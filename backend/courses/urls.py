from django.urls import path
from .views import CourseListView, CourseDetailView, RecommendedCoursesView

urlpatterns = [
    path('', CourseListView.as_view(), name='course_list'),
    path('recommended/', RecommendedCoursesView.as_view(), name='course_recommended'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
]
