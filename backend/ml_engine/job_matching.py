"""
Transparent Job Matching and Candidate Recommendation Engine.
"""
from jobs.models import Job, JobSkill
from learners.models import StudentProfile, StudentSkill

def calculate_job_match(student, job):
    """
    Computes transparent, weighted match percentage between a candidate and a job opening.
    """
    if not student or not job:
        return {
            'match_percentage': 0,
            'matching_skills': [],
            'missing_skills': [],
            'is_eligible': False
        }

    job_skills = job.job_skills.all().select_related('skill')
    if not job_skills.exists():
        # If no explicit skills tagged, default to 75% baseline
        return {
            'match_percentage': 75,
            'matching_skills': [],
            'missing_skills': [],
            'is_eligible': True
        }

    # Fetch candidate proficiencies
    student_skills = StudentSkill.objects.filter(student=student).select_related('skill')
    learner_prof_map = {ss.skill.name.lower(): ss.proficiency_percentage for ss in student_skills}

    total_weight_required = 0.0
    total_candidate_weighted_score = 0.0

    matching_skills = []
    missing_skills = []
    mandatory_failed = False

    for js in job_skills:
        skill_name = js.skill.name
        req_prof = js.required_proficiency
        weight = js.weight
        is_mandatory = js.is_mandatory

        actual_prof = learner_prof_map.get(skill_name.lower(), 0)

        # Contribution
        weighted_req = req_prof * weight
        # Effective proficiency capped at requirement so excess in 1 doesn't artificially inflate others
        effective_prof = min(actual_prof, req_prof)
        weighted_cand = effective_prof * weight

        total_weight_required += weighted_req
        total_candidate_weighted_score += weighted_cand

        # Threshold for matching
        if actual_prof >= (req_prof * 0.65) and actual_prof > 0:
            matching_skills.append({
                'skill': skill_name,
                'candidate_proficiency': actual_prof,
                'required_proficiency': req_prof,
                'verified': True
            })
        else:
            missing_skills.append({
                'skill': skill_name,
                'candidate_proficiency': actual_prof,
                'required_proficiency': req_prof,
                'gap': req_prof - actual_prof,
                'is_mandatory': is_mandatory
            })
            if is_mandatory and actual_prof < 30:
                mandatory_failed = True

    if total_weight_required > 0:
        raw_match = (total_candidate_weighted_score / total_weight_required) * 100
        match_percentage = round(min(100, max(15, raw_match)))
    else:
        match_percentage = 70

    is_eligible = not mandatory_failed and match_percentage >= 50

    return {
        'match_percentage': match_percentage,
        'matching_skills': matching_skills,
        'missing_skills': missing_skills,
        'is_eligible': is_eligible
    }

def get_recommended_jobs_for_student(student):
    """
    Ranks all active jobs by personalized match score for the given student.
    """
    if not student:
        return []

    jobs = Job.objects.filter(is_active=True).prefetch_related('job_skills__skill', 'employer')
    results = []

    for job in jobs:
        match_data = calculate_job_match(student, job)
        results.append({
            'id': job.id,
            'title': job.title,
            'company_name': job.employer.company_name,
            'industry': job.employer.industry,
            'location': job.location,
            'district': job.district,
            'state': job.state,
            'salary_min': job.salary_min,
            'salary_max': job.salary_max,
            'salary_lpa_display': f"₹{round(job.salary_min / 100000, 1)} - ₹{round(job.salary_max / 100000, 1)} LPA",
            'experience_min': job.experience_min,
            'experience_max': job.experience_max,
            'job_type': job.job_type,
            'match_percentage': match_data['match_percentage'],
            'matching_skills': [s['skill'] for s in match_data['matching_skills']],
            'missing_skills': [s['skill'] for s in match_data['missing_skills']],
            'is_eligible': match_data['is_eligible'],
            'description': job.description,
            'created_at': job.created_at
        })

    # Sort descending by match percentage
    results.sort(key=lambda x: x['match_percentage'], reverse=True)
    return results

def get_matching_candidates_for_job(job):
    """
    Ranks registered learners against an employer's job opening.
    """
    students = StudentProfile.objects.all().prefetch_related('skills__skill', 'user')
    ranked_candidates = []

    for s in students:
        match_data = calculate_job_match(s, job)
        ranked_candidates.append({
            'student_id': s.id,
            'full_name': s.full_name,
            'email': s.user.email,
            'phone': s.phone,
            'education': s.education,
            'location': s.location,
            'district': s.district,
            'state': s.state,
            'employment_status': s.employment_status,
            'match_percentage': match_data['match_percentage'],
            'matching_skills': [m['skill'] for m in match_data['matching_skills']],
            'missing_skills': [m['skill'] for m in match_data['missing_skills']],
            'is_eligible': match_data['is_eligible']
        })

    ranked_candidates.sort(key=lambda x: x['match_percentage'], reverse=True)
    return ranked_candidates
