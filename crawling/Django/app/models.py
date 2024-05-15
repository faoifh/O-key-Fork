from django.db import models

# Create your models here.

class Economy(models.Model):
    title = models.TextField()
    content = models.TextField()

#Add other classes like above
