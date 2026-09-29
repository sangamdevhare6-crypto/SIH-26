from django.urls import path
from .views import JobListCreateView, JobDetailView, RecommendedJobsView, EmployerMyJobsView

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job_list_create'),
    path('recommended/', RecommendedJobsView.as_view(), name='job_recommended'),
    path('my-jobs/', EmployerMyJobsView.as_view(), name='employer_my_jobs'),
    path('<int:pk>/', JobDetailView.as_view(), name='job_detail'),
]
