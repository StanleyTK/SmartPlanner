from django.db import models
from users.models import CustomUser
from tags.models import Tag

class Task(models.Model):
    PRIORITY_CHOICES = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
    ]

    title = models.CharField(max_length=50)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_created = models.DateField(db_index=True)
    is_completed = models.BooleanField(default=False, db_index=True)
    description = models.TextField()
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2, db_index=True)
    tag = models.ForeignKey(Tag, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        indexes = [
            # Composite index for filtering by user and date range
            models.Index(fields=['user', 'date_created'], name='task_user_date_idx'),
            # Composite index for filtering by user and tag
            models.Index(fields=['user', 'tag'], name='task_user_tag_idx'),
            # Composite index for filtering by user and completion status
            models.Index(fields=['user', 'is_completed'], name='task_user_completed_idx'),
            # Composite index for filtering by user and priority
            models.Index(fields=['user', 'priority'], name='task_user_priority_idx'),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.username}"
