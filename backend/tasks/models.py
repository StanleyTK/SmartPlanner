from django.db import models
from users.models import CustomUser

class Task(models.Model):
    PRIORITY_CHOICES = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
    ]

    title = models.CharField(max_length=50)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_created = models.DateField()  # User-provided date instead of auto-generated
    is_completed = models.BooleanField(default=False)
    description = models.TextField()
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2)
    tags = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"
