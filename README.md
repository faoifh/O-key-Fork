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

### 사용법

1. Crawling 폴더의 RunDjango.bat 파일을 실행
2. <http://127.0.0.1:8000/news/?crawl_type=type> 로 접속
3. url의 마지막 'type'을 원하는 원하는 타입으로 수정

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

---
### 의존성

스크립트 실행을 위하여 다음이 필요합니다.

BeautifulSoup4

requests

json

