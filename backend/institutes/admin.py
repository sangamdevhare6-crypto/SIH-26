from django.contrib import admin
from .models import TrainingInstitute

@admin.register(TrainingInstitute)
class TrainingInstituteAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'contact_person', 'email', 'phone', 'district', 'state', 'accreditation', 'is_verified')
    list_filter = ('state', 'district', 'is_verified')
    search_fields = ('name', 'code', 'email', 'contact_person', 'district')
