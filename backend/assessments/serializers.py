from rest_framework import serializers
from .models import Assessment, AssessmentQuestion, AssessmentResult

class AssessmentQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentQuestion
        fields = ('id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'sub_skill', 'difficulty')

class AssessmentQuestionWithAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentQuestion
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = Assessment
        fields = '__all__'

class AssessmentDetailSerializer(serializers.ModelSerializer):
    questions = AssessmentQuestionSerializer(many=True, read_only=True)
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = Assessment
        fields = '__all__'

class AssessmentResultSerializer(serializers.ModelSerializer):
    assessment_title = serializers.CharField(source='assessment.title', read_only=True)
    assessment_category = serializers.CharField(source='assessment.category', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = AssessmentResult
        fields = '__all__'
