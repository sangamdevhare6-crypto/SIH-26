from django.urls import path
from .views import StudentProfileView, StudentSkillListView, StudentSkillDetailView, StudentTrainingProgressView, AllLearnersListView

urlpatterns = [
    path('profile/', StudentProfileView.as_view(), name='student_profile'),
    path('skills/', StudentSkillListView.as_view(), name='student_skills'),
    path('skills/<int:pk>/', StudentSkillDetailView.as_view(), name='student_skill_detail'),
    path('training/', StudentTrainingProgressView.as_view(), name='student_training'),
    path('all/', AllLearnersListView.as_view(), name='learners_all'),
]
