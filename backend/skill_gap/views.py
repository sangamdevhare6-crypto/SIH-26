from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from ml_engine.skill_gap import TARGET_ROLES, analyze_student_skill_gap
from learners.models import StudentProfile

class SkillGapOverviewView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        roles_summary = []
        for role_key, role_val in TARGET_ROLES.items():
            roles_summary.append({
                'title': role_val['title'],
                'category': role_val['category'],
                'description': role_val['description'],
                'avg_starting_salary': role_val['avg_starting_salary'],
                'skills_count': len(role_val['skills']),
                'required_skills': list(role_val['skills'].keys())
            })

        response_data = {
            'available_roles': roles_summary,
            'current_analysis': None
        }

        student = getattr(user, 'student_profile', None)
        if not student:
            student_id = request.query_params.get('student_id')
            if student_id:
                try:
                    student = StudentProfile.objects.get(id=student_id)
                except StudentProfile.DoesNotExist:
                    pass

        if student:
            role = request.query_params.get('role') or student.target_role or 'Junior Data Analyst'
            response_data['current_analysis'] = analyze_student_skill_gap(student, role)

        return Response(response_data)

class SkillGapAnalyzeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        student = getattr(user, 'student_profile', None)

        student_id = request.data.get('student_id')
        if not student and student_id:
            try:
                student = StudentProfile.objects.get(id=student_id)
            except StudentProfile.DoesNotExist:
                return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not student:
            return Response({'error': 'A student profile is required to calculate skill gaps.'}, status=status.HTTP_400_BAD_REQUEST)

        target_role = request.data.get('target_role') or request.data.get('role') or student.target_role or 'Junior Data Analyst'
        
        # Save as student's target role
        student.target_role = target_role
        student.save()

        analysis_result = analyze_student_skill_gap(student, target_role)
        return Response(analysis_result, status=status.HTTP_200_OK)
