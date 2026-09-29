from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        return Response({
            'message': 'Registration successful.',
            'tokens': tokens,
            'user': user_data
        }, status=status.HTTP_201_CREATED)

class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email_or_username = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        if not email_or_username or not password:
            return Response({'error': 'Email/Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Allow login by email or username
        user = None
        if '@' in email_or_username:
            try:
                user_obj = User.objects.get(email__iexact=email_or_username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(username=email_or_username, password=password)

        if not user:
            return Response({'error': 'Invalid credentials. Please verify your email/username and password.'}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        # Add profile reference if exists
        profile_data = {}
        if user.role == 'student' and hasattr(user, 'student_profile'):
            profile_data = {
                'profile_id': user.student_profile.id,
                'full_name': user.student_profile.full_name,
                'education': user.student_profile.education,
                'location': user.student_profile.location
            }
        elif user.role == 'institute' and hasattr(user, 'institute_profile'):
            profile_data = {
                'profile_id': user.institute_profile.id,
                'name': user.institute_profile.name,
                'code': user.institute_profile.code
            }
        elif user.role == 'employer' and hasattr(user, 'employer_profile'):
            profile_data = {
                'profile_id': user.employer_profile.id,
                'company_name': user.employer_profile.company_name,
                'industry': user.employer_profile.industry
            }

        return Response({
            'message': 'Login successful.',
            'tokens': tokens,
            'user': user_data,
            'profile': profile_data
        }, status=status.HTTP_200_OK)

class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

class UserProfileView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        user = request.user

        if user.role == 'student' and hasattr(user, 'student_profile'):
            from learners.serializers import StudentProfileSerializer
            data['student_profile'] = StudentProfileSerializer(user.student_profile).data
        elif user.role == 'institute' and hasattr(user, 'institute_profile'):
            from institutes.serializers import TrainingInstituteSerializer
            data['institute_profile'] = TrainingInstituteSerializer(user.institute_profile).data
        elif user.role == 'employer' and hasattr(user, 'employer_profile'):
            from employers.serializers import EmployerSerializer
            data['employer_profile'] = EmployerSerializer(user.employer_profile).data

        return Response(data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
