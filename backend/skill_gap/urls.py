from django.urls import path
from .views import SkillGapOverviewView, SkillGapAnalyzeView

urlpatterns = [
    path('', SkillGapOverviewView.as_view(), name='skill_gap_overview'),
    path('analyze/', SkillGapAnalyzeView.as_view(), name='skill_gap_analyze'),
]
