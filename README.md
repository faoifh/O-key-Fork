# O-Key

### 브랜치 개요

이 브랜치는 faoifh, Goni-Goni에 의해 관리되며, 해당 프로젝트의 크롤링과 관련된 요소들을 담당합니다.

### 소개

이 브랜치는 각 뉴스 사이트에서 사용자가 희망하는 분야에 대한 뉴스 기사를 크롤링하여, Django api를 통해 Json 형식으로 반환하는 기능을 제공합니다. 

### 설치

1. 저장소 클론 :
```
 git clone https://github.com/O-key-Do-key/O-key.git
```
2. 해당 브랜치로 체크아웃 :
```
git checkout faoifh
```

### 의존성

스크립트 실행을 위하여 다음 라이브러리를 설치해야 합니다.

```
pip3 install BeautifulSoup4
pip3 install requests
pip3 install django
pip3 install djangorestframework
pip install JPype1
pip install konlpy
```

### 사용법

1. `cd crawling/Django` 명령을 사용하여 Django 폴더로 이동
2. `python manage.py runserver` 명령 실행 
3. <http://127.0.0.1:8000/news/?crawl_type=type> 로 접속
4. url의 마지막 'type'을 원하는 원하는 타입으로 수정

- 서버에서 실행하는 경우, `python3 manage.py runserver 0.0.0.0:8000` 명령을 통해 실행

#### 사용 가능한 타입

> economy : 경제
> 
> politics : 정치
> 
> society : 사회
> 
> culture : 문화
> 
> science : 과학기술/IT
> 
> world : 국제
> 
> sport : 스포츠
> 
> enter : 연예
> 
> people : 인물
> 
> education : 교육

해당 type들은 crawler.selectCrawlType 메소드의 CRAWL_TYPES 리스트에 작성되어 있습니다.


### 반환되는 데이터

크롤링 타입, 각 기사의 언론사, 제목, 본문 내용, 가장 많이 언급된 상위 100개 키워드

---


### 언론사 목록

해당 스크립트에서 크롤링하는 언론사의 목록입니다.


경향신문 <https://www.khan.co.kr/>

내일신문 <https://www.naeil.com/>

동아일보 <https://www.donga.com/>

문화일보 <https://www.munhwa.com/>

서울신문 <https://www.seoul.co.kr/>

서울일보 <https://www.seoulilbo.com/>

아시아투데이 <https://www.asiatoday.co.kr/>

중앙일보 <https://www.joongang.co.kr/>
