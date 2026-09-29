"""
Skill Gap Detection and Upskilling Engine
Transparent, explainable recommendation logic ready for ML pipeline integration.
"""
from skills.models import Skill
from learners.models import StudentProfile, StudentSkill
from courses.models import Course, CourseSkill

# Industry Benchmark Profiles for Standard Roles
TARGET_ROLES = {
    'Junior Data Analyst': {
        'title': 'Junior Data Analyst',
        'category': 'Data & Analytics',
        'description': 'Analyzes complex datasets, generates executive dashboards, and delivers actionable business intelligence.',
        'avg_starting_salary': '₹5.5 - 9.0 LPA',
        'skills': {
            'Python': {'target': 80, 'weight': 1.2, 'mandatory': True},
            'SQL': {'target': 75, 'weight': 1.3, 'mandatory': True},
            'Excel': {'target': 70, 'weight': 1.0, 'mandatory': False},
            'Power BI': {'target': 65, 'weight': 1.1, 'mandatory': True},
            'Statistics': {'target': 70, 'weight': 1.1, 'mandatory': True},
        }
    },
    'Full Stack Developer': {
        'title': 'Full Stack Developer',
        'category': 'Software Engineering',
        'description': 'Builds responsive frontends and resilient backends using modern web frameworks and databases.',
        'avg_starting_salary': '₹6.0 - 11.0 LPA',
        'skills': {
            'JavaScript': {'target': 85, 'weight': 1.3, 'mandatory': True},
            'Python': {'target': 80, 'weight': 1.2, 'mandatory': True},
            'HTML/CSS': {'target': 85, 'weight': 1.0, 'mandatory': True},
            'SQL': {'target': 75, 'weight': 1.1, 'mandatory': True},
            'Data Structures': {'target': 75, 'weight': 1.2, 'mandatory': True},
            'Git': {'target': 70, 'weight': 0.9, 'mandatory': False},
        }
    },
    'AI & Machine Learning Engineer': {
        'title': 'AI & Machine Learning Engineer',
        'category': 'Artificial Intelligence',
        'description': 'Develops machine learning models, neural pipelines, and predictive algorithms for production systems.',
        'avg_starting_salary': '₹8.0 - 15.0 LPA',
        'skills': {
            'Python': {'target': 90, 'weight': 1.4, 'mandatory': True},
            'AI/ML': {'target': 80, 'weight': 1.5, 'mandatory': True},
            'Statistics': {'target': 80, 'weight': 1.2, 'mandatory': True},
            'Data Structures': {'target': 75, 'weight': 1.1, 'mandatory': True},
            'SQL': {'target': 70, 'weight': 1.0, 'mandatory': False},
        }
    },
    'Cloud & DevOps Engineer': {
        'title': 'Cloud & DevOps Engineer',
        'category': 'Cloud Infrastructure',
        'description': 'Deploys and maintains CI/CD infrastructure, cloud workloads, container orchestration, and telemetry.',
        'avg_starting_salary': '₹7.0 - 13.0 LPA',
        'skills': {
            'Cloud Computing': {'target': 85, 'weight': 1.4, 'mandatory': True},
            'Python': {'target': 70, 'weight': 1.1, 'mandatory': False},
            'SQL': {'target': 65, 'weight': 0.9, 'mandatory': False},
            'Problem Solving': {'target': 80, 'weight': 1.2, 'mandatory': True},
            'Cyber Security': {'target': 70, 'weight': 1.1, 'mandatory': False},
        }
    },
    'Cyber Security Analyst': {
        'title': 'Cyber Security Analyst',
        'category': 'Security & Compliance',
        'description': 'Monitors threat vectors, performs vulnerability assessments, and enforces cybersecurity hygiene.',
        'avg_starting_salary': '₹6.5 - 12.0 LPA',
        'skills': {
            'Cyber Security': {'target': 85, 'weight': 1.5, 'mandatory': True},
            'Cloud Computing': {'target': 75, 'weight': 1.2, 'mandatory': True},
            'Python': {'target': 65, 'weight': 1.0, 'mandatory': False},
            'Problem Solving': {'target': 80, 'weight': 1.1, 'mandatory': True},
        }
    }
}

def analyze_student_skill_gap(student, target_role_name=None):
    """
    Computes transparent, dynamic skill gap metrics for a given learner.
    """
    if not student:
        return None

    role_name = target_role_name or student.target_role or 'Junior Data Analyst'
    role_def = TARGET_ROLES.get(role_name)
    if not role_def:
        role_def = TARGET_ROLES['Junior Data Analyst']
        role_name = 'Junior Data Analyst'

    # Fetch learner's current skills
    student_skills = StudentSkill.objects.filter(student=student).select_related('skill')
    learner_skill_map = {ss.skill.name.lower(): ss.proficiency_percentage for ss in student_skills}

    required_skills_dict = role_def['skills']

    comparison_breakdown = []
    total_target_weighted = 0.0
    total_actual_weighted = 0.0

    missing_skills = []
    weak_skills = []
    strong_skills = []

    for skill_name, req in required_skills_dict.items():
        target_prof = req['target']
        weight = req['weight']
        actual_prof = learner_skill_map.get(skill_name.lower(), 0)

        # Contribution
        weighted_target = target_prof * weight
        weighted_actual = min(actual_prof, target_prof) * weight

        total_target_weighted += weighted_target
        total_actual_weighted += weighted_actual

        gap = max(0, target_prof - actual_prof)

        skill_item = {
            'skill_name': skill_name,
            'required_proficiency': target_prof,
            'actual_proficiency': actual_prof,
            'gap_percentage': gap,
            'weight': weight,
            'mandatory': req['mandatory'],
            'status': 'Met' if actual_prof >= target_prof else ('Weak' if actual_prof > 0 else 'Missing')
        }
        comparison_breakdown.append(skill_item)

        if actual_prof == 0 or actual_prof < 40:
            missing_skills.append({
                'name': skill_name,
                'current': actual_prof,
                'target': target_prof,
                'gap': gap,
                'reason': 'Not yet acquired or critically below minimum role proficiency.'
            })
        elif actual_prof < target_prof:
            weak_skills.append({
                'name': skill_name,
                'current': actual_prof,
                'target': target_prof,
                'gap': gap,
                'reason': f'Proficiency is {actual_prof}%, below required {target_prof}%.'
            })
        else:
            strong_skills.append({
                'name': skill_name,
                'current': actual_prof,
                'target': target_prof
            })

    # Calculate overall readiness and gap percentage
    if total_target_weighted > 0:
        readiness_score = round((total_actual_weighted / total_target_weighted) * 100, 1)
        skill_gap_percentage = round(100.0 - readiness_score, 1)
    else:
        readiness_score = 0.0
        skill_gap_percentage = 100.0

    # Find targeted course recommendations to close this specific gap
    from ml_engine.course_recommendation import get_targeted_courses_for_gaps
    gap_skill_names = [m['name'] for m in missing_skills] + [w['name'] for w in weak_skills]
    targeted_courses = get_targeted_courses_for_gaps(gap_skill_names)

    return {
        'target_role': role_name,
        'role_category': role_def['category'],
        'role_description': role_def['description'],
        'avg_starting_salary': role_def['avg_starting_salary'],
        'readiness_percentage': readiness_score,
        'overall_skill_gap_percentage': skill_gap_percentage,
        'comparison_breakdown': comparison_breakdown,
        'missing_skills': missing_skills,
        'weak_skills': weak_skills,
        'strong_skills': strong_skills,
        'recommended_courses': targeted_courses
    }
