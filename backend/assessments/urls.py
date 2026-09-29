from django.urls import path
from .views import AssessmentListView, AssessmentDetailView, SubmitAssessmentView, StudentAssessmentHistoryView

urlpatterns = [
    path('', AssessmentListView.as_view(), name='assessment_list'),
    path('submit/', SubmitAssessmentView.as_view(), name='assessment_submit'),
    path('history/', StudentAssessmentHistoryView.as_view(), name='assessment_history'),
    path('<int:pk>/', AssessmentDetailView.as_view(), name='assessment_detail'),
]
