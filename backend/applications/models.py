from django.db import models
from learners.models import StudentProfile
from jobs.models import Job
from employers.models import Employer

class Application(models.Model):
    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Shortlisted', 'Shortlisted'),
        ('Interview', 'Interview Scheduled'),
        ('Selected', 'Selected / Hired'),
        ('Rejected', 'Not Selected'),
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Applied')
    applied_date = models.DateTimeField(auto_now_add=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    remarks = models.TextField(blank=True, default='')
    match_score = models.FloatField(default=70.0, help_text="Calculated skill match percentage at application time")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'job')
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.student.full_name} -> {self.job.title} ({self.status})"

class EmploymentOutcome(models.Model):
    PLACEMENT_TYPE_CHOICES = (
        ('Government Skilling Drive', 'Government Skilling Drive Placement'),
        ('Campus Placement', 'Campus Placement via Institute'),
        ('Direct Industry Hire', 'Direct Industry Hire'),
        ('Apprenticeship Conversion', 'Apprenticeship Conversion'),
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='employment_outcomes')
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name='hires')
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True, related_name='hired_outcomes')
    job_title = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200)
    salary_lpa = models.FloatField(default=6.0, help_text="Annual CTC in Lakhs Per Annum")
    placement_date = models.DateField()
    placement_type = models.CharField(max_length=60, choices=PLACEMENT_TYPE_CHOICES, default='Government Skilling Drive')
    verified_by_institute = models.BooleanField(default=True)
    verified_by_government = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-placement_date']

    def __str__(self):
        return f"{self.student.full_name} placed at {self.company_name} ({self.salary_lpa} LPA)"
