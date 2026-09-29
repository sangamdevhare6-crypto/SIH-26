from rest_framework import serializers
from .models import TrainingInstitute

class TrainingInstituteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = TrainingInstitute
        fields = '__all__'
