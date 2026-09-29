"""
Course Recommendation Engine based on detected skill gaps.
"""
from courses.models import Course, CourseSkill
from learners.models import StudentSkill

def get_targeted_courses_for_gaps(gap_skill_names):
    """
    Finds and ranks courses that deliver proficiencies in the identified gap skills.
    """
    if not gap_skill_names:
        return []

    # Case-insensitive matching
    lower_names = [n.lower() for n in gap_skill_names]
    
    courses = Course.objects.filter(
        is_active=True,
        course_skills__skill__name__iregex=r'(' + '|'.join(lower_names) + ')'
    ).distinct().prefetch_related('course_skills__skill', 'institute')

    results = []
    for c in courses:
        addressed_skills = []
        for cs in c.course_skills.all():
            if cs.skill.name.lower() in lower_names:
                addressed_skills.append({
                    'skill_name': cs.skill.name,
                    'target_proficiency': cs.target_proficiency
                })

        if addressed_skills:
            primary_skill = addressed_skills[0]['skill_name']
            reason = f"Your {primary_skill} proficiency is below the required level for your target role. This course helps bridge that specific gap."
            
            results.append({
                'id': c.id,
                'title': c.title,
                'provider': c.provider,
                'institute_name': c.institute.name if c.institute else c.provider,
                'category': c.category,
                'duration_weeks': c.duration_weeks,
                'level': c.level,
                'price': c.price,
                'certificate_provided': c.certificate_provided,
                'course_url': c.course_url,
                'description': c.description,
                'skills_covered': [s['skill_name'] for s in addressed_skills],
                'addressed_skills_count': len(addressed_skills),
                'recommendation_reason': reason
            })

    # Sort courses by most gap skills addressed
    results.sort(key=lambda x: x['addressed_skills_count'], reverse=True)
    return results[:8]

def get_recommended_courses_for_student(student):
    """
    Returns personalized course recommendations based on learner's lowest proficiency skills.
    """
    if not student:
        # Return popular courses
        courses = Course.objects.filter(is_active=True).prefetch_related('course_skills__skill')[:6]
        return [{
            'id': c.id,
            'title': c.title,
            'provider': c.provider,
            'category': c.category,
            'duration_weeks': c.duration_weeks,
            'level': c.level,
            'price': c.price,
            'certificate_provided': c.certificate_provided,
            'course_url': c.course_url,
            'recommendation_reason': 'Popular foundational upskilling curriculum.'
        } for c in courses]

    from ml_engine.skill_gap import analyze_student_skill_gap
    analysis = analyze_student_skill_gap(student)
    gap_skills = [m['name'] for m in analysis['missing_skills']] + [w['name'] for w in analysis['weak_skills']]

    if not gap_skills:
        # If learner has high proficiency across all, recommend advanced courses
        courses = Course.objects.filter(is_active=True, level='Advanced').prefetch_related('course_skills__skill')[:6]
        return [{
            'id': c.id,
            'title': c.title,
            'provider': c.provider,
            'category': c.category,
            'duration_weeks': c.duration_weeks,
            'level': c.level,
            'price': c.price,
            'certificate_provided': c.certificate_provided,
            'course_url': c.course_url,
            'recommendation_reason': 'Advanced mastery course to further boost your leadership in your chosen domain.'
        } for c in courses]

    return get_targeted_courses_for_gaps(gap_skills)
