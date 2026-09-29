from django.urls import path
from .views import ApplicationListCreateView, ApplicationDetailView, EmploymentOutcomeListView

urlpatterns = [
    path('', ApplicationListCreateView.as_view(), name='application_list_create'),
    path('outcomes/', EmploymentOutcomeListView.as_view(), name='employment_outcomes'),
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application_detail'),
]
