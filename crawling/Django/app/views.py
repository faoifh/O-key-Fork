from django.shortcuts import render

# Create your views here.

from rest_framework import generics
from django.http import JsonResponse
from . import crawler

def get_crawled_data(request) :
    crawl_type = request.GET.get('crawl_type')
    
    data = crawler.crawling(crawl_type)
    headers = {"Content-Type": "application/json"}

    # JSON 응답 반환
    return JsonResponse(data, status=200)