from rest_framework import serializers
from .models import Application, EmploymentOutcome
from jobs.serializers import JobSerializer
from learners.serializers import StudentProfileSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_email = serializers.CharField(source='student.user.email', read_only=True)
    student_education = serializers.CharField(source='student.education', read_only=True)
    student_district = serializers.CharField(source='student.district', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.employer.company_name', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('applied_date', 'updated_at')

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('id', 'job', 'remarks')

    def create(self, validated_data):
        user = self.context['request'].user
        student = user.student_profile
        job = validated_data['job']

        if Application.objects.filter(student=student, job=job).exists():
            raise serializers.ValidationError({"detail": "You have already applied for this position."})

        from ml_engine.job_matching import calculate_job_match
        match_info = calculate_job_match(student, job)
        match_score = match_info.get('match_percentage', 70.0)

        application = Application.objects.create(
            student=student,
            job=job,
            match_score=match_score,
            remarks=validated_data.get('remarks', '')
        )
        return application

class EmploymentOutcomeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)

    class Meta:
        model = EmploymentOutcome
        fields = '__all__'
