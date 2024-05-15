from django.shortcuts import render

# Create your views here.

from rest_framework import generics
from .models import Economy
from .serializers import EconomySerializer

class EconomyListView(generics.ListCreateAPIView):
    queryset = Economy.objects.all()
    serializer_class = EconomySerializer