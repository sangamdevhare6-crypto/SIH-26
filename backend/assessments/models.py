from django.db import models
from skills.models import Skill
from learners.models import StudentProfile

class Assessment(models.Model):
    CATEGORY_CHOICES = (
        ('Python', 'Python Programming'),
        ('SQL', 'SQL & Database Queries'),
        ('HTML/CSS', 'HTML/CSS & Frontend'),
        ('JavaScript', 'JavaScript Fundamentals'),
        ('Data Structures', 'Data Structures & Algorithms'),
        ('AI/ML', 'AI & Machine Learning'),
        ('Power BI', 'Business Intelligence & Power BI'),
        ('Cloud Computing', 'Cloud Computing & AWS/GCP'),
        ('Communication', 'Communication & Professional Skills'),
        ('Problem Solving', 'Aptitude & Problem Solving'),
    )

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Python')
    skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, blank=True, related_name='assessments')
    description = models.TextField(blank=True, default='')
    duration_minutes = models.IntegerField(default=15)
    total_questions = models.IntegerField(default=5)
    passing_score = models.IntegerField(default=60)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"

class AssessmentQuestion(models.Model):
    OPTION_CHOICES = (
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C'),
        ('D', 'Option D'),
    )
    DIFFICULTY_CHOICES = (
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    )

    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=300)
    option_b = models.CharField(max_length=300)
    option_c = models.CharField(max_length=300)
    option_d = models.CharField(max_length=300)
    correct_option = models.CharField(max_length=2, choices=OPTION_CHOICES)
    explanation = models.TextField(blank=True, default='')
    sub_skill = models.CharField(max_length=100, default='Core Concept')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='Medium')

    def __str__(self):
        return f"Q: {self.question_text[:50]}... ({self.assessment.title})"

class AssessmentResult(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='assessment_results')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='results')
    score_percentage = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    strong_skills = models.JSONField(default=list)
    moderate_skills = models.JSONField(default=list)
    weak_skills = models.JSONField(default=list)
    answers_record = models.JSONField(default=dict)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.student.full_name} - {self.assessment.title}: {self.score_percentage}%"
