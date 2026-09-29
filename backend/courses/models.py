from django.db import models
from institutes.models import TrainingInstitute
from skills.models import Skill

class Course(models.Model):
    LEVEL_CHOICES = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    )

    institute = models.ForeignKey(TrainingInstitute, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=150, default='National Skill Development Mission')
    category = models.CharField(max_length=100, default='Data & Analytics')
    duration_weeks = models.IntegerField(default=8)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Intermediate')
    description = models.TextField(blank=True, default='')
    course_url = models.CharField(max_length=300, blank=True, default='https://swayam.gov.in')
    price = models.IntegerField(default=0, help_text="Cost in INR (0 = Free/Govt Sponsored)")
    certificate_provided = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.provider})"

class CourseSkill(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='course_links')
    target_proficiency = models.IntegerField(default=75, help_text="Target proficiency level (0-100)% delivered by course")

    class Meta:
        unique_together = ('course', 'skill')

    def __str__(self):
        return f"{self.course.title} -> {self.skill.name} ({self.target_proficiency}%)"
