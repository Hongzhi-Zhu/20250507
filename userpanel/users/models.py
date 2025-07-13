from django.db import models

# Create your models here.

from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    affiliate = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Preference(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='preferences')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.name} - {self.name}"
