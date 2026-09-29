from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Assessment, AssessmentQuestion, AssessmentResult
from .serializers import AssessmentSerializer, AssessmentDetailSerializer, AssessmentResultSerializer
from learners.models import StudentProfile, StudentSkill
from notifications.models import Notification

class AssessmentListView(generics.ListAPIView):
    queryset = Assessment.objects.all().prefetch_related('questions')
    serializer_class = AssessmentSerializer
    permission_classes = (permissions.AllowAny,)

class AssessmentDetailView(generics.RetrieveAPIView):
    queryset = Assessment.objects.all().prefetch_related('questions')
    serializer_class = AssessmentDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)

class SubmitAssessmentView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        try:
            student = user.student_profile
        except StudentProfile.DoesNotExist:
            return Response({'error': 'Only student accounts can submit assessments.'}, status=status.HTTP_403_FORBIDDEN)

        assessment_id = request.data.get('assessment_id')
        user_answers = request.data.get('answers', {})  # { question_id: "A" }

        if not assessment_id:
            return Response({'error': 'Assessment ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assessment = Assessment.objects.prefetch_related('questions').get(id=assessment_id)
        except Assessment.DoesNotExist:
            return Response({'error': 'Assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        questions = assessment.questions.all()
        total_questions = len(questions)

        if total_questions == 0:
            return Response({'error': 'This assessment has no questions configured.'}, status=status.HTTP_400_BAD_REQUEST)

        correct_count = 0
        detailed_breakdown = []
        strong_subskills = set()
        weak_subskills = set()

        for q in questions:
            selected = str(user_answers.get(str(q.id)) or user_answers.get(q.id) or '').upper().strip()
            is_correct = (selected == q.correct_option)
            if is_correct:
                correct_count += 1
                strong_subskills.add(q.sub_skill)
            else:
                weak_subskills.add(q.sub_skill)

            detailed_breakdown.append({
                'question_id': q.id,
                'question_text': q.question_text,
                'selected_option': selected,
                'correct_option': q.correct_option,
                'is_correct': is_correct,
                'explanation': q.explanation,
                'sub_skill': q.sub_skill
            })

        score_percentage = round((correct_count / total_questions) * 100)

        # Categorize Strong, Moderate, Weak
        strong_list = list(strong_subskills)
        weak_list = list(weak_subskills - strong_subskills)
        moderate_list = []
        if score_percentage >= 75:
            strong_list.append(assessment.category)
        elif score_percentage >= 50:
            moderate_list.append(assessment.category)
        else:
            weak_list.append(assessment.category)

        # Save AssessmentResult
        result = AssessmentResult.objects.create(
            student=student,
            assessment=assessment,
            score_percentage=score_percentage,
            total_questions=total_questions,
            correct_answers=correct_count,
            strong_skills=strong_list,
            moderate_skills=moderate_list,
            weak_skills=weak_list,
            answers_record=user_answers
        )

        # Update or create student's verified StudentSkill
        if assessment.skill:
            st_skill, created = StudentSkill.objects.get_or_create(
                student=student,
                skill=assessment.skill,
                defaults={
                    'proficiency_percentage': score_percentage,
                    'assessment_score': score_percentage,
                    'verified': (score_percentage >= assessment.passing_score)
                }
            )
            if not created:
                # Dynamically update skill proficiency with latest assessment
                new_proficiency = max(st_skill.proficiency_percentage, score_percentage)
                st_skill.proficiency_percentage = new_proficiency
                st_skill.assessment_score = score_percentage
                if score_percentage >= assessment.passing_score:
                    st_skill.verified = True
                st_skill.save()

        # Create system notification
        Notification.objects.create(
            user=user,
            title='Assessment Completed',
            message=f'You scored {score_percentage}% in {assessment.title}. Your skill profile has been updated.',
            notification_type='assessment',
            link='/student/skills'
        )

        return Response({
            'message': 'Assessment submitted successfully.',
            'result_id': result.id,
            'score_percentage': score_percentage,
            'correct_answers': correct_count,
            'total_questions': total_questions,
            'passing_score': assessment.passing_score,
            'passed': score_percentage >= assessment.passing_score,
            'strong_skills': strong_list,
            'moderate_skills': moderate_list,
            'weak_skills': weak_list,
            'detailed_breakdown': detailed_breakdown,
            'completed_at': result.completed_at
        }, status=status.HTTP_201_CREATED)

class StudentAssessmentHistoryView(generics.ListAPIView):
    serializer_class = AssessmentResultSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return AssessmentResult.objects.filter(student=user.student_profile).select_related('assessment')
        return AssessmentResult.objects.none()
