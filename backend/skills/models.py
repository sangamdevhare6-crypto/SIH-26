from django.db import models

class Skill(models.Model):
    CATEGORY_CHOICES = (
        ('Programming', 'Programming Languages'),
        ('Data & Analytics', 'Data & Analytics'),
        ('AI & Machine Learning', 'AI & Machine Learning'),
        ('Cloud & DevOps', 'Cloud & DevOps'),
        ('Web Development', 'Web Development'),
        ('Cyber Security', 'Cyber Security'),
        ('Database', 'Database Management'),
        ('Soft Skills', 'Soft Skills & Leadership'),
    )

    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Programming')
    description = models.TextField(blank=True, default='')
    market_demand_weight = models.FloatField(default=1.0, help_text="Weight from 0.1 to 2.0 based on current market job postings")
    is_trending = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.category})"
