from rest_framework import serializers
from .models import Course, CourseSkill
from skills.serializers import SkillSerializer

class CourseSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    skill_category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = CourseSkill
        fields = ('id', 'skill', 'skill_name', 'skill_category', 'target_proficiency')

class CourseSerializer(serializers.ModelSerializer):
    course_skills = CourseSkillSerializer(many=True, read_only=True)
    institute_name = serializers.CharField(source='institute.name', read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

class CourseCreateSerializer(serializers.ModelSerializer):
    skills_data = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)

    class Meta:
        model = Course
        fields = '__all__'

    def create(self, validated_data):
        skills_data = validated_data.pop('skills_data', [])
        course = Course.objects.create(**validated_data)
        from skills.models import Skill
        for s in skills_data:
            skill_id = s.get('skill_id')
            target_proficiency = s.get('target_proficiency', 75)
            if skill_id:
                try:
                    sk = Skill.objects.get(id=skill_id)
                    CourseSkill.objects.create(course=course, skill=sk, target_proficiency=target_proficiency)
                except Skill.DoesNotExist:
                    pass
        return course
