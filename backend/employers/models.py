from django.db import models
from django.conf import settings

class Employer(models.Model):
    INDUSTRY_CHOICES = (
        ('Information Technology', 'Information Technology & Software'),
        ('BFSI / FinTech', 'Banking, Financial Services & Insurance'),
        ('Healthcare & MedTech', 'Healthcare & Medical Technology'),
        ('Manufacturing & Auto', 'Manufacturing & Automotive'),
        ('E-Commerce & Retail', 'E-Commerce & Retail'),
        ('Telecom & Networking', 'Telecom & Networking'),
        ('Education & EdTech', 'Education & EdTech'),
        ('Government & Public Sector', 'Government & Public Sector'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100, choices=INDUSTRY_CHOICES, default='Information Technology')
    contact_person = models.CharField(max_length=100, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField(blank=True, default='')
    district = models.CharField(max_length=100, default='Bengaluru')
    state = models.CharField(max_length=100, default='Karnataka')
    website = models.CharField(max_length=255, blank=True, default='')
    company_size = models.CharField(max_length=50, default='50-250 Employees')
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} ({self.industry})"
