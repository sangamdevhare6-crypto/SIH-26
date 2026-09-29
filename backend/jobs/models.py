from django.db import models
from employers.models import Employer
from skills.models import Skill

class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Internship', 'Internship'),
        ('Apprenticeship', 'Apprenticeship'),
        ('Contract', 'Contract'),
    )

    employer = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    department = models.CharField(max_length=100, default='Technology & Analytics')
    location = models.CharField(max_length=150, default='Pune, Maharashtra')
    district = models.CharField(max_length=100, default='Pune')
    state = models.CharField(max_length=100, default='Maharashtra')
    salary_min = models.IntegerField(default=400000, help_text="Minimum Annual Salary in INR")
    salary_max = models.IntegerField(default=800000, help_text="Maximum Annual Salary in INR")
    experience_min = models.IntegerField(default=0, help_text="Minimum years of experience")
    experience_max = models.IntegerField(default=2, help_text="Maximum years of experience")
    job_type = models.CharField(max_length=30, choices=JOB_TYPE_CHOICES, default='Full-time')
    vacancies = models.IntegerField(default=3)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.employer.company_name}"

class JobSkill(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='job_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='job_skills')
    required_proficiency = models.IntegerField(default=70, help_text="Required proficiency from 0 to 100")
    is_mandatory = models.BooleanField(default=True)
    weight = models.FloatField(default=1.0, help_text="Relative weight for matching algorithms")

    class Meta:
        unique_together = ('job', 'skill')

    def __str__(self):
        return f"{self.job.title} requires {self.skill.name} ({self.required_proficiency}%)"
