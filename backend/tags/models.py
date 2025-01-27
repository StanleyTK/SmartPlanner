from django.db import models
from users.models import CustomUser

class Tag(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=50)

    class Meta:
        unique_together = ('user', 'name')
        indexes = [
            models.Index(fields=['user', 'name']),
        ]

    def __str__(self):
        return f"{self.name} - {self.user.username}"
