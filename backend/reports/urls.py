from django.urls import path
from .views import (
    ExportSkillGapCSVView,
    ExportEmploymentOutcomeCSVView,
    ExportTrainingImpactCSVView,
    ExportIndustryDemandCSVView
)

urlpatterns = [
    path('skill-gap/', ExportSkillGapCSVView.as_view(), name='report_skill_gap_csv'),
    path('employment-outcomes/', ExportEmploymentOutcomeCSVView.as_view(), name='report_employment_csv'),
    path('training-impact/', ExportTrainingImpactCSVView.as_view(), name='report_training_csv'),
    path('industry-demand/', ExportIndustryDemandCSVView.as_view(), name='report_industry_demand_csv'),
]
