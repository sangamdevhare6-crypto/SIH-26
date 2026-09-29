from django.contrib import admin
from .models import Employer

@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'industry', 'contact_person', 'email', 'phone', 'district', 'state', 'company_size', 'is_verified')
    list_filter = ('industry', 'state', 'district', 'is_verified')
    search_fields = ('company_name', 'email', 'contact_person', 'industry')
