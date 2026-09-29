from django.contrib import admin
from .models import Course, CourseSkill

class CourseSkillInline(admin.TabularInline):
    model = CourseSkill
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'provider', 'institute_name', 'category', 'duration_weeks', 'level', 'price', 'certificate_provided', 'is_active')
    list_filter = ('category', 'level', 'certificate_provided', 'is_active')
    search_fields = ('title', 'provider', 'description')
    inlines = [CourseSkillInline]

    def institute_name(self, obj):
        return obj.institute.name if obj.institute else 'Public Scheme'

@admin.register(CourseSkill)
class CourseSkillAdmin(admin.ModelAdmin):
    list_display = ('course', 'skill', 'target_proficiency')
    search_fields = ('course__title', 'skill__name')
