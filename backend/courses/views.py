from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Course, CourseSkill
from .serializers import CourseSerializer, CourseCreateSerializer
from learners.models import StudentProfile, StudentSkill

class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.filter(is_active=True).prefetch_related('course_skills__skill', 'institute')
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'category', 'provider', 'description', 'course_skills__skill__name']
    ordering_fields = ['created_at', 'duration_weeks', 'price']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseCreateSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'institute_profile'):
            serializer.save(institute=user.institute_profile)
        else:
            serializer.save()

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all().prefetch_related('course_skills__skill', 'institute')
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class RecommendedCoursesView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        from ml_engine.course_recommendation import get_recommended_courses_for_student
        
        student = None
        if hasattr(user, 'student_profile'):
            student = user.student_profile
        else:
            student_id = request.query_params.get('student_id')
            if student_id:
                try:
                    student = StudentProfile.objects.get(id=student_id)
                except StudentProfile.DoesNotExist:
                    pass

        recommendations = get_recommended_courses_for_student(student)
        return Response(recommendations)
