import requests
import json
from bs4 import BeautifulSoup

POLITICS = 100
ECONOMY = 101

def crawling(type, type_num) :
    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://news.naver.com/section/"+str(type_num), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')

    newsBox = soup.find('div', attrs={"class": "section_latest"})
    news = newsBox.select('.sa_text_title')

    for link in news: # 뉴스마다 제목과 내용을 따옴
        subRes = requests.get(link.attrs['href'], headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')

        article_text = subSoup.select('#dic_area')

        title = link.text.strip() # 제목 따오기

        for letter in article_text: # 내용 따오기
            content = letter.text.strip()
    
        # JSON 형식으로 데이터 변환
        data = {
            "type" : type,
            "title": title, 
            "content" : content
        }
        
        data_bundle.append(data)
        
    return data_bundle

def selectCrawlType(crawl_type) :
    #type 에 따라 조건문 수행
    if crawl_type == 'economy' :
        return crawling('economy', ECONOMY)
    
    elif crawl_type == 'politics':
        return crawling('politics', POLITICS)
        
    #else :
        #title = "no data"
        #content = "no data"
