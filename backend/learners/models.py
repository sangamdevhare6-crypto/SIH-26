from django.db import models
from django.conf import settings
from skills.models import Skill

class StudentProfile(models.Model):
    EMPLOYMENT_STATUS_CHOICES = (
        ('Seeking Opportunities', 'Seeking Opportunities'),
        ('Not Employed', 'Not Employed'),
        ('In Training', 'Currently in Training'),
        ('Employed / Placed', 'Employed / Placed'),
        ('Self-Employed / Freelancer', 'Self-Employed / Freelancer'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, default='')
    education = models.CharField(max_length=150, default='B.Tech in Computer Science')
    college_institute = models.CharField(max_length=200, default='Government Engineering College, Pune')
    location = models.CharField(max_length=100, default='Pune, Maharashtra')
    district = models.CharField(max_length=100, default='Pune')
    state = models.CharField(max_length=100, default='Maharashtra')
    career_interests = models.CharField(max_length=255, default='Data Analyst, Python Developer, AI Engineer')
    target_role = models.CharField(max_length=100, default='Junior Data Analyst')
    experience_years = models.FloatField(default=0.0)
    bio = models.TextField(blank=True, default='Passionate learner enthusiastic about software engineering, data analytics, and cloud technologies.')
    certifications = models.TextField(blank=True, default='National Apprenticeship Certificate (NAC), Python for Data Science')
    employment_status = models.CharField(max_length=50, choices=EMPLOYMENT_STATUS_CHOICES, default='Seeking Opportunities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.district}, {self.state})"

class StudentSkill(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='student_proficiencies')
    proficiency_percentage = models.IntegerField(default=50, help_text="Current estimated proficiency from 0 to 100")
    assessment_score = models.IntegerField(default=0, help_text="Most recent formal assessment score 0 to 100")
    last_assessed_date = models.DateTimeField(auto_now=True)
    verified = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'skill')
        ordering = ['-proficiency_percentage']

    def __str__(self):
        return f"{self.student.full_name} - {self.skill.name}: {self.proficiency_percentage}%"

class TrainingProgress(models.Model):
    STATUS_CHOICES = (
        ('Enrolled', 'Enrolled'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Certified', 'Certified'),
        ('Dropped', 'Dropped'),
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='training_progress')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='student_enrollments')
    institute = models.ForeignKey('institutes.TrainingInstitute', on_delete=models.SET_NULL, null=True, blank=True, related_name='trained_students')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='In Progress')
    completion_percentage = models.IntegerField(default=0)
    pre_assessment_score = models.IntegerField(default=40, help_text="Benchmark score before training")
    post_assessment_score = models.IntegerField(default=75, help_text="Measured score after training")
    enrolled_date = models.DateField(auto_now_add=True)
    completed_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.course.title} ({self.status}: {self.completion_percentage}%)"
