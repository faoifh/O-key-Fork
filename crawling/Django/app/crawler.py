import requests
import json
from bs4 import BeautifulSoup

def crawling(crawl_type) :

    #type 에 따라 조건문 수행
    if crawl_type == 'economy' :
        title = "dummy title1"
        content = "dummy contents1"
    elif crawl_type == 'politics':
        title = "dummy title2"
        content = "dummy contents2"
    else :
        title = "no data"
        content = "no data"


    # JSON 형식으로 데이터 변환
    data = {
        "type" : crawl_type,
        "title": title, 
        "content" : content
        }  
    
    return data