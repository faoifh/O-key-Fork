import requests
import json
from bs4 import BeautifulSoup

def crawling(crawl_type) :

    data_bundle = crawl_naver(crawl_type) #네이버 뉴스 크롤링
    data_bundle.extend(crawl_daum(crawl_type)) #Daum 뉴스 크롤링

    #JSON 형식으로 데이터 변환 및 타입 태그 추가
    data = {
        'crawl_type' : crawl_type,
        'data' : data_bundle
    }
        
    return data

def selectCrawlType(crawl_type) :
    CRAWL_TYPES = ['economy', 'politics'] # 크롤링 타입 리스트

    #crawl_type 에 따라 조건문 수행
    if(crawl_type in CRAWL_TYPES ) : # 리스트에 포함된 타입인 경우에만 수행
        return crawling(crawl_type)
    else : # 잘못된 타입인 경우
        return {
            'crawl_type' : crawl_type,
            'title' : "no data",
            'content' : "no data"
        }
        
def crawl_naver(crawl_type) : # 네이버 뉴스 크롤링
    TYPETAG = {'politics' : 100, 
               'economy' : 101} # 타입에 따른 주소 태그의 딕셔너리

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://news.naver.com/section/"+str(TYPETAG[crawl_type]), headers=header)
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
    
        # 제목과 내용 배열에 삽입
        data_bundle.append({"title": title, "content": content})

    return data_bundle

def crawl_daum(crawl_type) : # 다음 뉴스 크롤링
    TYPETAG = {'politics' : 'politics', 
               'economy' : 'economic'} # 타입에 따른 주소 태그의 딕셔너리

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열

    res = requests.get("https://news.daum.net/"+str(TYPETAG[crawl_type]) + '#1', headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')

    newsBox = soup.find(class_='list_newsmajor')
    news = newsBox.select('.link_txt')

    for link in news: # 뉴스마다 제목과 내용을 따옴
        subRes = requests.get(link.attrs['href'], headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')

        article_text = subSoup.select('.article_view')

        title = link.get_text() # 제목 따오기

        for letter in article_text: # 내용 따오기
            content = letter.text.strip().replace('\n', '') # 개행 제거
    
        # 제목과 내용 배열에 삽입
        data_bundle.append({"title": title, "content": content})

    return data_bundle

