from django.urls import path
from .views import SkillListView, SkillDetailView, TrendingSkillsView

urlpatterns = [
    path('', SkillListView.as_view(), name='skill_list'),
    path('trending/', TrendingSkillsView.as_view(), name='skill_trending'),
    path('<int:pk>/', SkillDetailView.as_view(), name='skill_detail'),
]
