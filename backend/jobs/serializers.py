from rest_framework import serializers
from .models import Job, JobSkill
from skills.serializers import SkillSerializer

class JobSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    skill_category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = JobSkill
        fields = ('id', 'skill', 'skill_name', 'skill_category', 'required_proficiency', 'is_mandatory', 'weight')

class JobSerializer(serializers.ModelSerializer):
    job_skills = JobSkillSerializer(many=True, read_only=True)
    company_name = serializers.CharField(source='employer.company_name', read_only=True)
    company_industry = serializers.CharField(source='employer.industry', read_only=True)
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_applications_count(self, obj):
        return obj.applications.count()

class JobCreateSerializer(serializers.ModelSerializer):
    skills_data = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)

    class Meta:
        model = Job
        fields = '__all__'

    def create(self, validated_data):
        skills_data = validated_data.pop('skills_data', [])
        job = Job.objects.create(**validated_data)
        from skills.models import Skill
        for s in skills_data:
            skill_id = s.get('skill_id')
            required_proficiency = s.get('required_proficiency', 70)
            is_mandatory = s.get('is_mandatory', True)
            weight = s.get('weight', 1.0)
            if skill_id:
                try:
                    sk = Skill.objects.get(id=skill_id)
                    JobSkill.objects.create(
                        job=job,
                        skill=sk,
                        required_proficiency=required_proficiency,
                        is_mandatory=is_mandatory,
                        weight=weight
                    )
                except Skill.DoesNotExist:
                    pass
        return job
