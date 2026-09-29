from rest_framework import serializers
from .models import StudentProfile, StudentSkill, TrainingProgress
from skills.serializers import SkillSerializer

class StudentSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    skill_category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = StudentSkill
        fields = ('id', 'student', 'skill', 'skill_name', 'skill_category', 'proficiency_percentage', 'assessment_score', 'last_assessed_date', 'verified')
        read_only_fields = ('id', 'last_assessed_date')

class TrainingProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_provider = serializers.CharField(source='course.provider', read_only=True)
    institute_name = serializers.CharField(source='institute.name', read_only=True)

    class Meta:
        model = TrainingProgress
        fields = '__all__'

class StudentProfileSerializer(serializers.ModelSerializer):
    skills = StudentSkillSerializer(many=True, read_only=True)
    training_progress = TrainingProgressSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = StudentProfile
        fields = '__all__'
