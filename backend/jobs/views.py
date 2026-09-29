from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Job, JobSkill
from .serializers import JobSerializer, JobCreateSerializer
from learners.models import StudentProfile
from ml_engine.job_matching import get_recommended_jobs_for_student, calculate_job_match

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.filter(is_active=True).prefetch_related('job_skills__skill', 'employer')
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location', 'district', 'state', 'department', 'employer__company_name']
    ordering_fields = ['created_at', 'salary_max', 'salary_min']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'employer_profile'):
            serializer.save(employer=user.employer_profile)
        else:
            from employers.models import Employer
            emp = Employer.objects.first()
            serializer.save(employer=emp)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        user = request.user
        student = getattr(user, 'student_profile', None) if user.is_authenticated else None

        # If authenticated student, calculate match metrics for each job dynamically
        if student and isinstance(response.data, list):
            for item in response.data:
                try:
                    job = Job.objects.get(id=item['id'])
                    match_data = calculate_job_match(student, job)
                    item['match_percentage'] = match_data['match_percentage']
                    item['matching_skills'] = match_data['matching_skills']
                    item['missing_skills'] = match_data['missing_skills']
                    item['is_eligible'] = match_data['is_eligible']
                except Exception:
                    item['match_percentage'] = 70
                    item['matching_skills'] = []
                    item['missing_skills'] = []
                    item['is_eligible'] = True

        return response

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all().prefetch_related('job_skills__skill', 'employer')
    serializer_class = JobSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        user = request.user
        student = getattr(user, 'student_profile', None) if user.is_authenticated else None
        if student:
            try:
                job = self.get_object()
                match_data = calculate_job_match(student, job)
                response.data['match_percentage'] = match_data['match_percentage']
                response.data['matching_skills'] = match_data['matching_skills']
                response.data['missing_skills'] = match_data['missing_skills']
                response.data['is_eligible'] = match_data['is_eligible']
            except Exception:
                pass
        return response

class RecommendedJobsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
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

        recommended = get_recommended_jobs_for_student(student)
        return Response(recommended)

class EmployerMyJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'employer_profile'):
            return Job.objects.filter(employer=user.employer_profile).prefetch_related('job_skills__skill')
        return Job.objects.none()
