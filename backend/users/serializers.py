from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'avatar', 'created_at')
        read_only_fields = ('id', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    organization_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password', 'role', 'phone', 'full_name', 'organization_name')

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value.lower()

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        # Username defaults to email — check uniqueness here to avoid DB-level 500
        username = attrs.get('username') or attrs.get('email', '')
        if username:
            qs = User.objects.filter(username__iexact=username)
            if qs.exists():
                raise serializers.ValidationError(
                    {"username": "A user with this username/email already exists."}
                )
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        full_name = validated_data.pop('full_name', '')
        organization_name = validated_data.pop('organization_name', '')
        password = validated_data.pop('password')
        
        # If username not explicitly provided or is email, make username email or unique
        username = validated_data.get('username')
        if not username:
            username = validated_data.get('email')
            validated_data['username'] = username

        user = User.objects.create_user(password=password, **validated_data)
        
        # Split full_name into first_name and last_name if given
        if full_name:
            parts = full_name.strip().split(' ', 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
            user.save()

        # Create corresponding profile
        from learners.models import StudentProfile
        from institutes.models import TrainingInstitute
        from employers.models import Employer

        if user.role == 'student':
            StudentProfile.objects.get_or_create(
                user=user,
                defaults=dict(
                    full_name=full_name or f"{user.first_name} {user.last_name}".strip() or user.username,
                    phone=user.phone or ''
                )
            )
        elif user.role == 'institute':
            TrainingInstitute.objects.get_or_create(
                user=user,
                defaults=dict(
                    name=organization_name or full_name or f"{user.first_name}'s Institute",
                    contact_person=full_name or user.username,
                    email=user.email,
                    phone=user.phone or ''
                )
            )
        elif user.role == 'employer':
            Employer.objects.get_or_create(
                user=user,
                defaults=dict(
                    company_name=organization_name or full_name or f"{user.first_name}'s Enterprise",
                    contact_person=full_name or user.username,
                    email=user.email,
                    phone=user.phone or ''
                )
            )
        # 'admin' role: no separate profile model needed
        return user
