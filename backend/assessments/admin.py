from django.contrib import admin
from .models import Assessment, AssessmentQuestion, AssessmentResult

class AssessmentQuestionInline(admin.StackedInline):
    model = AssessmentQuestion
    extra = 1

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'skill', 'total_questions', 'duration_minutes', 'passing_score')
    list_filter = ('category',)
    search_fields = ('title', 'description')
    inlines = [AssessmentQuestionInline]

@admin.register(AssessmentQuestion)
class AssessmentQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text_short', 'assessment', 'correct_option', 'difficulty', 'sub_skill')
    list_filter = ('difficulty', 'correct_option', 'assessment')
    search_fields = ('question_text', 'sub_skill')

    def question_text_short(self, obj):
        return obj.question_text[:60] + '...' if len(obj.question_text) > 60 else obj.question_text

@admin.register(AssessmentResult)
class AssessmentResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'assessment', 'score_percentage', 'correct_answers', 'total_questions', 'completed_at')
    list_filter = ('assessment', 'completed_at')
    search_fields = ('student__full_name', 'assessment__title')
