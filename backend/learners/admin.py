from django.contrib import admin
from .models import StudentProfile, StudentSkill, TrainingProgress

class StudentSkillInline(admin.TabularInline):
    model = StudentSkill
    extra = 1

class TrainingProgressInline(admin.TabularInline):
    model = TrainingProgress
    extra = 1

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user_email', 'district', 'state', 'target_role', 'employment_status', 'created_at')
    list_filter = ('employment_status', 'state', 'district', 'target_role')
    search_fields = ('full_name', 'user__email', 'education', 'district', 'state')
    inlines = [StudentSkillInline, TrainingProgressInline]

    def user_email(self, obj):
        return obj.user.email

@admin.register(StudentSkill)
class StudentSkillAdmin(admin.ModelAdmin):
    list_display = ('student', 'skill', 'proficiency_percentage', 'assessment_score', 'verified', 'last_assessed_date')
    list_filter = ('verified', 'skill__category')
    search_fields = ('student__full_name', 'skill__name')

@admin.register(TrainingProgress)
class TrainingProgressAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'institute', 'status', 'completion_percentage', 'pre_assessment_score', 'post_assessment_score')
    list_filter = ('status', 'institute')
    search_fields = ('student__full_name', 'course__title')
