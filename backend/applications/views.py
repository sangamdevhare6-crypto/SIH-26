from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.utils import timezone
from .models import Application, EmploymentOutcome
from .serializers import ApplicationSerializer, ApplicationCreateSerializer, EmploymentOutcomeSerializer
from notifications.models import Notification

class ApplicationListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApplicationCreateSerializer
        return ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        job_id = self.request.query_params.get('job_id')
        status_param = self.request.query_params.get('status')

        qs = Application.objects.select_related('student__user', 'job__employer')

        if hasattr(user, 'student_profile'):
            qs = qs.filter(student=user.student_profile)
        elif hasattr(user, 'employer_profile'):
            qs = qs.filter(job__employer=user.employer_profile)
        elif user.role == 'admin' or user.is_superuser:
            pass
        else:
            return Application.objects.none()

        if job_id:
            qs = qs.filter(job_id=job_id)
        if status_param:
            qs = qs.filter(status=status_param)

        return qs

    def perform_create(self, serializer):
        application = serializer.save()
        # Notify employer
        job = application.job
        Notification.objects.create(
            user=job.employer.user,
            title='New Candidate Application',
            message=f"{application.student.full_name} applied for {job.title} with a {application.match_score}% skill match.",
            notification_type='application',
            link='/employer/applications'
        )

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.select_related('student__user', 'job__employer')
    serializer_class = ApplicationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        old_status = instance.status
        new_status = request.data.get('status', old_status)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Status transition actions
        if new_status != old_status:
            student_user = instance.student.user
            Notification.objects.create(
                user=student_user,
                title='Application Status Updated',
                message=f"Your application for {instance.job.title} at {instance.job.employer.company_name} is now: {new_status}.",
                notification_type='application',
                link='/student/applications'
            )

            # If selected / hired, record EmploymentOutcome and update learner status
            if new_status == 'Selected':
                student = instance.student
                student.employment_status = 'Employed / Placed'
                student.save()

                # Calculate LPA from salary
                salary_avg = (instance.job.salary_min + instance.job.salary_max) / 200000.0  # e.g. 6.0 LPA
                
                EmploymentOutcome.objects.get_or_create(
                    student=student,
                    employer=instance.job.employer,
                    job=instance.job,
                    defaults={
                        'job_title': instance.job.title,
                        'company_name': instance.job.employer.company_name,
                        'salary_lpa': round(salary_avg, 2),
                        'placement_date': timezone.now().date(),
                        'placement_type': 'Government Skilling Drive',
                        'verified_by_institute': True,
                        'verified_by_government': True,
                    }
                )

        return Response(serializer.data)

class EmploymentOutcomeListView(generics.ListAPIView):
    queryset = EmploymentOutcome.objects.select_related('student', 'employer')
    serializer_class = EmploymentOutcomeSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filterset_fields = ['placement_type', 'verified_by_government']
