import requests
import json
import threading
from bs4 import BeautifulSoup
from konlpy.tag import Komoran
from collections import Counter

crawl_limit = 50 # 최대 크롤링 가능 개수
komoran = Komoran()

# bad keyword 목록
bad_keyword_list = ['것', '등', '위', '고', '수', '더', '디', '김', '차', '회', '및', '안', '전', '며', '날', '이', '윤', '을', '를', '뒤', '일', '년', '간', '개', '명']

# 크롤링 타입 리스트
CRAWL_TYPES = ['economy', 'politics', 'society', 'culture', 'science', 'world', 'sport', 'enter', 'people', 'education'] 
    #경제, 정치, 사회, 문화, 과학(IT), 세계, 스포츠, 연예, + 인물, 교육

class KeywordList(list) : #키워드를 저장하기 위해 제작된 클래스
    def addKey(self, key) :
        if key not in bad_keyword_list : # bad keyword에 포함되지 않은 경우에만 추가
            self.append(key)


def crawling(crawl_type) :
    #경향신문 O, 내일신문 O , 동아일보 O, 문화일보 O, 서울신문 O, 서울일보 O, 세계일보 X (크롤링 허용 X), 
    #아시아투데이 O, 조선일보, 중앙일보 O , 한겨레 (크롤링 허용 X), 한국일보 (크롤링 허용 X)

    data_bundle = []
    keywords = KeywordList()# 키워드 목록
    crawl_count = [0]# 정수 데이터를 call-by-reference 방식으로 전달하기 위하여 리스트로 선언

    threads = [] # 쓰레드 리스트

    #각 크롤링 함수들을 쓰레드에 지정
    threads.append(threading.Thread(target = crawl_khan, args=(crawl_type, data_bundle, crawl_count, keywords)))#경향신문
    threads.append(threading.Thread(target = crawl_naeil, args=(crawl_type, data_bundle, crawl_count, keywords)))#내일신문
    threads.append(threading.Thread(target = crawl_donga, args=(crawl_type, data_bundle, crawl_count, keywords)))#동아일보
    threads.append(threading.Thread(target = crawl_munhwa, args=(crawl_type, data_bundle, crawl_count, keywords)))#문화일보
    threads.append(threading.Thread(target = crawl_seoulNews, args=(crawl_type, data_bundle, crawl_count, keywords)))#서울신문
    threads.append(threading.Thread(target = crawl_seoulIlbo, args=(crawl_type, data_bundle, crawl_count, keywords)))#서울일보
    threads.append(threading.Thread(target = crawl_asia, args=(crawl_type, data_bundle, crawl_count, keywords)))#아시아투데이
    threads.append(threading.Thread(target = crawl_joongang, args=(crawl_type, data_bundle, crawl_count, keywords)))#중앙일보

    #쓰레드를 통해 크롤링을 동시에 실시
    for t in threads : t.start()

    #모든 쓰레드가 종료될 때 까지 대기
    for t in threads : t.join()

    counter = Counter(keywords) # 모든 키워드의 언급 빈도를 계산

    #JSON 형식으로 데이터 변환 및 타입 태그 추가
    data = {
        'crawl_type' : crawl_type,
        'data' : data_bundle,
        'frequency' : counter.most_common(100)
    }
    
    return data

def selectCrawlType(crawl_type) :
    #crawl_type 에 따라 조건문 수행
    if(crawl_type in CRAWL_TYPES ) : # 리스트에 포함된 타입인 경우에만 수행
        return crawling(crawl_type)
    else : # 잘못된 타입인 경우
        return {
            'crawl_type' : crawl_type,
            'title' : "no data",
            'content' : "no data"
        }

def increaseCount(count) : # 최대 크롤링 가능 갯수를 초과하지 않아 추가 크롤링이 가능한지 여부를 반환하는 함수 
    if count[0] >= crawl_limit : #최대 크롤링 가능 갯수와 비교 
            return False      
    count[0] += 1
    return True



def crawl_khan(crawl_type, return_data, count, keywords) : # 경향신문 크롤링, 경향 신문에는 사진과 제목만 존재하고 본문이 없는 경우도 있음.
    TYPETAG = {'politics' : 'politics', 
               'economy' : 'economy', 'society' : 'national', 'culture' : 'culture', 'science' : 'science/science-general/articles', 'world' : 'world', 'sport' : 'sports'} # 타입에 따른 주소 태그의 딕셔너리
    
    if not (crawl_type in TYPETAG) :
        return
    
    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.khan.co.kr/"+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='main-list-wrap')
    news = newsBox.select('.line_clamp2')

    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = link.attrs['href'] # 각 뉴스 기사의 url 획득
        subRes = requests.get(news_url, headers=header) # 해당 기사의 html 획득
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('#articleBody') #기사 본문 지정
        title = link.attrs['title']#기사 제목 저장

        for letter in article_text: # 내용 따오기
            content = letter.text.strip().replace('\n', '') # 개행 제거

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)# 모든 key 추가
        
        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"경향신문", "url" : news_url, "title": title, "content": content})
    
    return_data.extend(data_bundle)


def crawl_naeil(crawl_type, return_data, count, keywords) : # 내일신문 크롤링
    TYPETAG = {'politics' : 'politics',
               'economy' : 'economy', 'society' : 'policy', 'science' : 'industry', 'world' : 'diplomacy'} # 타입에 따른 주소 태그의 딕셔너리

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.naeil.com/"+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='story-list')
    news = newsBox.find_all(class_ = 'headline')
 
    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = "https://www.naeil.com" + link.find('a').attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('.article-view')
        title = link.text.strip()

        for letter in article_text: # 내용 따오기
            content = letter.text.strip().replace('\n', '') # 개행 제거

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"내일신문", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)

def crawl_donga(crawl_type, return_data, count, keywords) : # 동아일보 크롤링
    TYPETAG = {'politics' : 'Politics',
               'economy' : 'Economy', 'society' : 'Society', 'culture' : 'Culture', 'world' : 'Inter', 'sport' : 'Sports',
               'enter' : 'Entertainment'} # 타입에 따른 주소 태그의 딕셔너리

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.donga.com/news/"+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='row_list')
    news = newsBox.select('.tit')

    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = link.find('a').attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('.news_view')
        title = link.text.strip()

        for letter in article_text: # 내용 따오기
            content = letter.text.strip().replace('\n', '') # 개행 제거

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"동아일보", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)

def crawl_joongang(crawl_type, return_data, count, keywords) : # 중앙일보 크롤링
    TYPETAG = {'politics' : 'politics', 
               'economy' : 'money', 'society' : 'society', 'culture' : 'culture', 'world' : 'world', 'sport' : 'sports'} # 타입에 따른 주소 태그의 딕셔너리

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}  
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.joongang.co.kr/"+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='story_list')
    news = newsBox.select('.headline') 

    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = link.find('a').attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('#article_body')
        title = link.text.strip()

        for letter in article_text: # 내용 따오기
            content = letter.text.strip().replace('\n', '') # 개행 제거

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"중앙일보", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)

def crawl_munhwa(crawl_type, return_data, count, keywords) : # 문화일보 크롤링
    TYPETAG = {'politics' : 'politics',
               'economy' : 'economy', 'society' : 'society', 'culture' : 'culture', 'world' : 'international',
               'sport' : 'sports', 'enter' : 'ent', 'people':'people'} # 타입에 따른 주소 태그의 딕셔너리

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.munhwa.com/news/section_main.html?sec="+str(TYPETAG[crawl_type])+"&class=30", headers=header)
    html = res.content.decode('euc-kr','replace') # 인코딩을 euc-kr로 바꿈
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='news_list')
    news = newsBox.select('a.title')
    
    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = "https:" + link.attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.content.decode('euc-kr','replace') # 인코딩을 euc-kr로 바꿈
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('#News_content')
        title = link.text.strip()

        for letter in article_text: # 내용 따오기
            content = letter.text.strip().replace('\n', '') # 개행 제거

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"문화일보", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)
    

def crawl_seoulNews(crawl_type, return_data, count, keywords) : # 서울신문 크롤링
    TYPETAG = {'politics' : 'politics',
                'economy' : 'economy', 'society' : 'society', 'culture' : 'life', 'world' : 'international', 'sport' : 'sport',
                'people' : 'peoples'} # 타입에 따른 주소 태그의 딕셔너리

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.seoul.co.kr/newsList/"+str(TYPETAG[crawl_type]), headers=header)
    html = res.content.decode('utf-8','replace') # 인코딩을 utf-8로 바꿈
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='pageListWrap')
    news = newsBox.select('.articleTitle')

    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = "https://www.seoul.co.kr/" + link.find('a').attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.content.decode('utf-8','replace') # 인코딩을 utf-8로 바꿈
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('.viewContent')
        title = link.find('h2')
        title = title.text.strip()

        for letter in article_text: # 내용 따오기
            content = letter.text.strip()
            content = content.replace('\n', ' ') # 개행 제거
            content = content.replace('\t', '')
            content = content.replace('\r', '')

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"서울신문", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)

def crawl_seoulIlbo(crawl_type, return_data, count, keywords) : # 서울일보 크롤링
    TYPETAG = {'politics' : '8',
                'economy' : '9', 'society' : '10', 'culture' : '11', 'enter' : '12', 'world' : '14',
                'education' : '20'} # 타입에 따른 주소 태그의 딕셔너리

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.seoulilbo.com/news/articleList.html?sc_section_code=S1N"+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='section-body')
    news = newsBox.select('h4', attrs={"class": "titles"})

    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = "https://www.seoulilbo.com/"+link.find('a').attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('#article-view-content-div')
        title = link.text.strip()

        for letter in article_text: # 내용 따오기
            letter = letter.text.strip()
            letter = letter.replace('\xa0', ' ')
            letter = letter.replace('\n', ' ')
            content = letter # 개행 제거

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"서울일보", "url" : news_url, "title": title, "content": content})

    
    return_data.extend(data_bundle)

def crawl_asia(crawl_type, return_data, count, keywords) : # 아시아투데이 크롤링
    TYPETAG = {'politics' : '2',
                'society' : '3', 'economy' : '4', 'world' : '6', 'culture' : '7&d2=5', 'sport' : '7&d2=7',
                'enter' : '7&d2=2'} # 타입에 따른 주소 태그의 딕셔너리

    SPECIALTAG = ['sport', 'enter', 'culture'] #해당 태그들의 본문은 다른 tag로 find 메소드 사용 필요

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.asiatoday.co.kr/kn_section.php?d1="+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    newsBox = soup.find(class_='sub_section_news_box')
    news = newsBox.select('dl>dd>a')
    
    for link in news: # 뉴스마다 제목과 내용을 따옴

        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = "https://www.asiatoday.co.kr" + link.attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('.news_bm')
        
        if(crawl_type in SPECIALTAG) :
            title = link.find('h5')
        else :
            title = link.find('h4')

        title = title.text.strip()

        for letter in article_text: # 내용 따오기
            content = letter.text.strip()
            content = content.replace("\xa0", ' ')

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"아시아투데이", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)
    

#Not in use

'''
# newsBox.select() 에서 오류
def crawl_segye(crawl_type, return_data, count, keywords) : # 세계일보 크롤링
    TYPETAG = {'politics' : 'news/politics',
                'society' : 'news/society', 'culture' : 'news/culture', 'sport' : 'sports',
                'enter' : 'entertainment'} # 타입에 따른 주소 태그의 딕셔너리

    if not (crawl_type in TYPETAG) :
        return

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://www.segye.com/"+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    
    newsBox = soup.find(id='wps_layout2_box2')
    news = newsBox.select('ul>li>a')
    
    for link in news: # 뉴스마다 제목과 내용을 따옴
        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료

        news_url = link.attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text

        subSoup = BeautifulSoup(html, 'html.parser')
        article_text = subSoup.select('.viewBox2')

        title = link.find(class_='tit')
        title = title.text.strip()

        for letter in article_text: # 내용 따오기
            content = letter.text.strip()
            content = content.replace('\n', ' ') # 개행 제거
            content = content.replace('\t', '')
            content = content.replace('\r', '')

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"세계일보", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)
'''

'''
def crawl_naver(crawl_type, return_data, count, keywords) : # 네이버 뉴스 크롤링
    TYPETAG = {'politics' : 100, 
               'economy' : 101, 'society' : 102, 'culture' : 103, 'science' : 105, 'world' : 104} # 타입에 따른 주소 태그의 딕셔너리

    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열
    
    res = requests.get("https://news.naver.com/section/"+str(TYPETAG[crawl_type]), headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')

    newsBox = soup.find('div', attrs={"class": "section_latest"})
    news = newsBox.select('.sa_text_title')

    for link in news: # 뉴스마다 제목과 내용을 따옴
        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료
        
        news_url = link.attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')

        article_text = subSoup.select('#dic_area')

        title = link.text.strip() # 제목 따오기

        for letter in article_text: # 내용 따오기
            content = letter.text.strip()

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"네이버뉴스", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)

def crawl_daum(crawl_type, return_data, count, keywords) : # 다음 뉴스 크롤링
    TYPETAG = {'politics' : 'politics', 
               'economy' : 'economic', 'society' : 'society', 'culture' : 'culture', 'science' : 'digital', 'world' : 'foreign'} # 타입에 따른 주소 태그의 딕셔너리
    
    if TYPETAG.get(crawl_type) == None :
        return {}
    
    header = {'User-agent' : 'Mozila/2.0'}
    data_bundle=[] # 뉴스 정보를 담고 있는 JSON들의 배열

    res = requests.get("https://news.daum.net/"+str(TYPETAG[crawl_type]) + '#1', headers=header)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')

    newsBox = soup.find(class_='list_newsmajor')
    news = newsBox.select('.link_txt')

    for link in news: # 뉴스마다 제목과 내용을 따옴
        if not increaseCount(count) : break # 최대 기사 갯수 도달시 반복종료


        news_url = link.attrs['href']
        subRes = requests.get(news_url, headers=header)
        html = subRes.text
        subSoup = BeautifulSoup(html, 'html.parser')

        article_text = subSoup.select('.article_view')

        title = link.get_text() # 제목 따오기

        for letter in article_text: # 내용 따오기
            content = letter.text.strip().replace('\n', '') # 개행 제거

        nouns = komoran.nouns(title) # 명사를 분리하여 nouns에 저장
        for key in nouns :
            keywords.addKey(key)

        # 제목과 내용 배열에 삽입
        data_bundle.append({"company":"다음뉴스", "url" : news_url, "title": title, "content": content})

    return_data.extend(data_bundle)
'''