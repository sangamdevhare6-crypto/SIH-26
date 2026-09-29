from django.contrib import admin
from .models import Application, EmploymentOutcome

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'job_title', 'company_name', 'status', 'match_score', 'applied_date')
    list_filter = ('status', 'applied_date')
    search_fields = ('student__full_name', 'job__title', 'job__employer__company_name')

    def student_name(self, obj):
        return obj.student.full_name

    def job_title(self, obj):
        return obj.job.title

    def company_name(self, obj):
        return obj.job.employer.company_name

@admin.register(EmploymentOutcome)
class EmploymentOutcomeAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'company_name', 'job_title', 'salary_lpa', 'placement_type', 'placement_date', 'verified_by_government')
    list_filter = ('placement_type', 'verified_by_government', 'verified_by_institute')
    search_fields = ('student__full_name', 'company_name', 'job_title')

    def student_name(self, obj):
        return obj.student.full_name
