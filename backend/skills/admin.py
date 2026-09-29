from django.contrib import admin
from .models import Skill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'market_demand_weight', 'is_trending', 'created_at')
    list_filter = ('category', 'is_trending')
    search_fields = ('name', 'category', 'description')
    ordering = ('name',)
