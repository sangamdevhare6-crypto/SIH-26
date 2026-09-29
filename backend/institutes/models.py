from django.db import models
from django.conf import settings

class TrainingInstitute(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='institute_profile')
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    contact_person = models.CharField(max_length=100, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField(blank=True, default='')
    district = models.CharField(max_length=100, default='Pune')
    state = models.CharField(max_length=100, default='Maharashtra')
    website = models.CharField(max_length=255, blank=True, default='')
    accreditation = models.CharField(max_length=150, default='NSDC Accredited Training Partner')
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.district}, {self.state})"
