from rest_framework import serializers
from .models import Economy

class EconomySerializer(serializers.ModelSerializer):
    class Meta:
        model = Economy
        fields = ['title', 'content']