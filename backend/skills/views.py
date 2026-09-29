from rest_framework import generics, permissions, filters
from .models import Skill
from .serializers import SkillSerializer

class SkillListView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category', 'description']
    ordering_fields = ['name', 'category', 'market_demand_weight']

class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class TrendingSkillsView(generics.ListAPIView):
    queryset = Skill.objects.filter(is_trending=True).order_by('-market_demand_weight')[:10]
    serializer_class = SkillSerializer
    permission_classes = (permissions.AllowAny,)
