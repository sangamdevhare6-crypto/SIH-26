from rest_framework import generics, permissions, status, views, filters
from rest_framework.response import Response
from .models import StudentProfile, StudentSkill, TrainingProgress
from .serializers import StudentProfileSerializer, StudentSkillSerializer, TrainingProgressSerializer
from skills.models import Skill

class StudentProfileView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            profile = request.user.student_profile
            serializer = StudentProfileSerializer(profile)
            return Response(serializer.data)
        except StudentProfile.DoesNotExist:
            return Response({'error': 'Student profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            profile = request.user.student_profile
            serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except StudentProfile.DoesNotExist:
            return Response({'error': 'Student profile not found.'}, status=status.HTTP_404_NOT_FOUND)

class StudentSkillListView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        student = getattr(request.user, 'student_profile', None)
        if not student:
            # If admin or employer requesting with student_id param
            student_id = request.query_params.get('student_id')
            if student_id:
                try:
                    student = StudentProfile.objects.get(id=student_id)
                except StudentProfile.DoesNotExist:
                    return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response([], status=status.HTTP_200_OK)

        skills = StudentSkill.objects.filter(student=student)
        serializer = StudentSkillSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        student = getattr(request.user, 'student_profile', None)
        if not student:
            return Response({'error': 'Only student accounts can add skills.'}, status=status.HTTP_403_FORBIDDEN)

        skill_id = request.data.get('skill') or request.data.get('skill_id')
        proficiency = request.data.get('proficiency_percentage', 50)

        if not skill_id:
            return Response({'error': 'Skill ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            skill = Skill.objects.get(id=skill_id)
        except Skill.DoesNotExist:
            return Response({'error': 'Invalid skill ID.'}, status=status.HTTP_404_NOT_FOUND)

        student_skill, created = StudentSkill.objects.update_or_create(
            student=student,
            skill=skill,
            defaults={'proficiency_percentage': int(proficiency)}
        )
        return Response(StudentSkillSerializer(student_skill).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class StudentSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentSkillSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return StudentSkill.objects.filter(student=user.student_profile)
        return StudentSkill.objects.all()

class StudentTrainingProgressView(generics.ListCreateAPIView):
    serializer_class = TrainingProgressSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return TrainingProgress.objects.filter(student=user.student_profile)
        elif hasattr(user, 'institute_profile'):
            return TrainingProgress.objects.filter(institute=user.institute_profile)
        return TrainingProgress.objects.all()

class AllLearnersListView(generics.ListAPIView):
    queryset = StudentProfile.objects.all().prefetch_related('skills__skill', 'training_progress')
    serializer_class = StudentProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'district', 'state', 'education', 'target_role', 'career_interests']
    ordering_fields = ['created_at', 'full_name', 'district']
