from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student / Learner'),
        ('institute', 'Training Institute'),
        ('employer', 'Employer / Company'),
        ('admin', 'Government / Administrator'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.CharField(max_length=500, blank=True, null=True)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_student(self):
        return self.role == 'student'

    @property
    def is_institute(self):
        return self.role == 'institute'

    @property
    def is_employer(self):
        return self.role == 'employer'

    @property
    def is_government_admin(self):
        return self.role == 'admin' or self.is_superuser
