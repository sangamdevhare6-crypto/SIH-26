from django.contrib import admin
from .models import Job, JobSkill

class JobSkillInline(admin.TabularInline):
    model = JobSkill
    extra = 1

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer_name', 'department', 'location', 'salary_display', 'job_type', 'vacancies', 'is_active', 'created_at')
    list_filter = ('job_type', 'is_active', 'department', 'state')
    search_fields = ('title', 'employer__company_name', 'location', 'description')
    inlines = [JobSkillInline]

    def employer_name(self, obj):
        return obj.employer.company_name

    def salary_display(self, obj):
        return f"₹{round(obj.salary_min/100000, 1)} - ₹{round(obj.salary_max/100000, 1)} LPA"

@admin.register(JobSkill)
class JobSkillAdmin(admin.ModelAdmin):
    list_display = ('job', 'skill', 'required_proficiency', 'is_mandatory', 'weight')
    list_filter = ('is_mandatory', 'skill__category')
    search_fields = ('job__title', 'skill__name')
