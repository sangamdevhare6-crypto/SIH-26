from django.urls import path
from .views import TrainingInstituteProfileView, TrainingInstituteListView

urlpatterns = [
    path('profile/', TrainingInstituteProfileView.as_view(), name='institute_profile'),
    path('all/', TrainingInstituteListView.as_view(), name='institute_all'),
]
