import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import permissions
from learners.models import StudentProfile, StudentSkill, TrainingProgress
from applications.models import EmploymentOutcome
from courses.models import Course
from ml_engine.skill_gap import analyze_student_skill_gap
from ml_engine.industry_demand import get_industry_skill_demand_analytics

class ExportSkillGapCSVView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="kaushalsetu_skill_gap_report.csv"'

        writer = csv.writer(response)
        writer.writerow(['Learner ID', 'Full Name', 'District', 'State', 'Target Role', 'Readiness (%)', 'Skill Gap (%)', 'Missing Skills', 'Weak Skills'])

        students = StudentProfile.objects.all().prefetch_related('skills__skill')
        for s in students:
            analysis = analyze_student_skill_gap(s)
            missing = ", ".join([m['name'] for m in analysis['missing_skills']]) if analysis else 'None'
            weak = ", ".join([w['name'] for w in analysis['weak_skills']]) if analysis else 'None'
            readiness = analysis['readiness_percentage'] if analysis else 70
            gap = analysis['overall_skill_gap_percentage'] if analysis else 30

            writer.writerow([
                s.id,
                s.full_name,
                s.district,
                s.state,
                s.target_role,
                readiness,
                gap,
                missing,
                weak
            ])

        return response

class ExportEmploymentOutcomeCSVView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="kaushalsetu_employment_outcomes_report.csv"'

        writer = csv.writer(response)
        writer.writerow(['Placement ID', 'Candidate Name', 'District', 'Company Name', 'Job Title', 'Salary (LPA)', 'Placement Date', 'Placement Type', 'Govt Verified'])

        outcomes = EmploymentOutcome.objects.select_related('student', 'employer')
        for o in outcomes:
            writer.writerow([
                o.id,
                o.student.full_name,
                o.student.district,
                o.company_name,
                o.job_title,
                o.salary_lpa,
                o.placement_date,
                o.placement_type,
                'Yes' if o.verified_by_government else 'No'
            ])

        return response

class ExportTrainingImpactCSVView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="kaushalsetu_training_impact_report.csv"'

        writer = csv.writer(response)
        writer.writerow(['Course ID', 'Course Title', 'Provider / Institute', 'Duration (Weeks)', 'Enrolled Learners', 'Completed Learners', 'Completion Rate (%)'])

        courses = Course.objects.all().prefetch_related('student_enrollments')
        for c in courses:
            total = c.student_enrollments.count()
            comp = c.student_enrollments.filter(status='Completed').count()
            rate = round((comp / max(1, total)) * 100, 1)

            writer.writerow([
                c.id,
                c.title,
                c.provider,
                c.duration_weeks,
                total,
                comp,
                rate
            ])

        return response

class ExportIndustryDemandCSVView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="kaushalsetu_industry_demand_report.csv"'

        writer = csv.writer(response)
        writer.writerow(['Skill Name', 'Category', 'Active Job Demand Postings', 'Registered Talent Supply', 'Demand-Supply Ratio', 'Shortage Severity'])

        data = get_industry_skill_demand_analytics()
        for item in data['skill_demand']:
            writer.writerow([
                item['skill'],
                item['category'],
                item['demand_postings'],
                item['talent_supply'],
                item['demand_supply_ratio'],
                item['shortage_severity']
            ])

        return response
