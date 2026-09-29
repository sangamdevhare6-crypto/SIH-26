"""
Industry Skill Demand and Labor Market Analytics Engine.
"""
from django.db.models import Count, Avg
from skills.models import Skill
from jobs.models import Job, JobSkill
from learners.models import StudentSkill, StudentProfile

def get_industry_skill_demand_analytics():
    """
    Computes real-time market demand metrics from database job postings and learner profiles.
    """
    # 1. Top In-Demand Skills from active jobs
    job_skills_agg = JobSkill.objects.values('skill__name', 'skill__category').annotate(
        demand_count=Count('id'),
        avg_required_proficiency=Avg('required_proficiency')
    ).order_by('-demand_count')

    # 2. Learner Talent Supply Count for these skills
    learner_skills_agg = StudentSkill.objects.values('skill__name').annotate(
        supply_count=Count('id'),
        avg_student_proficiency=Avg('proficiency_percentage')
    )
    supply_map = {item['skill__name']: item for item in learner_skills_agg}

    skill_demand_list = []
    talent_shortage_list = []

    for js in job_skills_agg:
        name = js['skill__name']
        demand = js['demand_count']
        req_prof = round(js['avg_required_proficiency'] or 70)

        sup_info = supply_map.get(name, {'supply_count': 0, 'avg_student_proficiency': 0})
        supply = sup_info['supply_count']
        act_prof = round(sup_info['avg_student_proficiency'] or 0)

        # Gap Ratio
        gap_ratio = round((demand / max(1, supply)), 2)
        shortage_score = round(max(0, demand - supply) * (req_prof / 100) * 10)

        item = {
            'skill': name,
            'category': js['skill__category'],
            'demand_postings': demand,
            'talent_supply': supply,
            'avg_required_proficiency': req_prof,
            'avg_candidate_proficiency': act_prof,
            'demand_supply_ratio': gap_ratio,
            'shortage_severity': 'High' if gap_ratio > 1.5 or supply < 2 else ('Medium' if gap_ratio > 0.8 else 'Normal')
        }
        skill_demand_list.append(item)

        if item['shortage_severity'] in ['High', 'Medium']:
            talent_shortage_list.append(item)

    # 3. Industry-wise Hiring Breakdown
    industry_breakdown = Job.objects.filter(is_active=True).values('employer__industry').annotate(
        job_count=Count('id')
    ).order_by('-job_count')

    return {
        'skill_demand': skill_demand_list[:12],
        'critical_talent_shortages': talent_shortage_list[:6],
        'industry_hiring_distribution': list(industry_breakdown)
    }
