from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        'project': 'KaushalSetu AI',
        'tagline': 'Bridge Skills to Opportunities with AI',
        'problem_statement': 'SIH26135 - Difficulties in Tracking Employment Outcomes, Skill Gaps, and the Impact of Skilling Initiatives',
        'team': 'Team Dominator',
        'status': 'System Operational',
        'endpoints': {
            'auth': '/api/auth/',
            'students': '/api/students/',
            'institutes': '/api/institutes/',
            'employers': '/api/employers/',
            'skills': '/api/skills/',
            'jobs': '/api/jobs/',
            'courses': '/api/courses/',
            'assessments': '/api/assessments/',
            'applications': '/api/applications/',
            'skill_gap': '/api/skill-gap/',
            'notifications': '/api/notifications/',
            'analytics': '/api/analytics/',
            'reports': '/api/reports/'
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/auth/', include('users.urls')),
    path('api/skills/', include('skills.urls')),
    path('api/students/', include('learners.urls')),
    path('api/institutes/', include('institutes.urls')),
    path('api/employers/', include('employers.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/skill-gap/', include('skill_gap.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/reports/', include('reports.urls')),
]
