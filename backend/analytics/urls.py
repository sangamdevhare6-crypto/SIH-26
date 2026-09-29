from django.urls import path
from .views import StudentAnalyticsView, InstituteAnalyticsView, EmployerAnalyticsView, GovernmentAnalyticsView

urlpatterns = [
    path('student/', StudentAnalyticsView.as_view(), name='analytics_student'),
    path('institute/', InstituteAnalyticsView.as_view(), name='analytics_institute'),
    path('employer/', EmployerAnalyticsView.as_view(), name='analytics_employer'),
    path('government/', GovernmentAnalyticsView.as_view(), name='analytics_government'),
]
