# O-key
O-key는 다양한 언론사의 뉴스 기사를 분석하여 가장 많이 언급된 키워드들을 손쉽게 확인할 수 있도록 도와주는 웹 서비스입니다. 이 서비스는 최신 뉴스 트렌드를 빠르게 파악하고, 관심 있는 키워드를 선택하여서 관련된 뉴스 기사를 직접 읽을 수 있는 기능을 제공합니다. 'O-key'는 뉴스 소비 경험을 개인화하고, 효율적으로 중요한 정보를 수집할 수 있게 도와줍니다.

# branch 설명
- main: develop 브랜치에서 합친 내용이 문제가 없다면 최종적으로 해당 브랜치에 커밋.
- develop: 기초 파일 세팅 및 폴더 분리. Main 브랜치에서 각자 브랜치를 생성하여 작업 공간을 나누고 개발을 진행. 그리고 각자의 브랜치에서 만든 결과물들을 합쳐 하나의 프로그램으로 만듦.
## Feature branch
- doyun: 프론트엔드 작업 브랜치. 웹 페이지 개발과 관련된 내용들을 주로 커밋.
- faoifh: 크롤링 기능 작업 브랜치. 크롤링 구현을 담당한 팀원들에 의해 주로 관리되었으며, 주요 크롤링 기능을 커밋하는 브랜치. 제일 먼저 크롤링 기능 자체를 구현하여 커밋하였으며, 그 이후에 여러 기능 추가 및 개선, 버그 수정과 같은 작업을 진행.
- anhye0n: 백엔드 작업 브랜치. 서버 개발과 관련된 내용들을 주로 커밋.
- Goni-Goni: faoith에서 추가적인 작업을 진행하고 아무 문제가 없다고 판단되면 faoifh로 merge하는 브랜치. 해당 브랜치는 크롤링에서 기능을 추가했거나 버그 수정과 관련된 내용을 다른 팀원과 상의없이 혼자 작업하였을 때, 이 브랜치에 커밋하여 다른 팀원이 확인한 후에 최종적으로 faoifh 브랜치로 merge 하도록 하는 역할을 담당.


# 팀원

| 역할 | 이름  | Branch |
| --- | --- | --- |
| 프론트엔드 | 김도윤 | doyun |
| 백엔드 | 안정현 | anhye0n |
| 크롤링 | 박재우(팀장), 김건희 | faoifh, Goni-Goni | 

# 사용방법

### 설치
```bash
git clone https://github.com/O-key-Do-key/O-key.git
```

## Frontend
### 사용 기술
- React
- Redux
- Axios

### 라이브러리 설치
```bash
 sudo npm install
```
### 실행
```bash
 sudo npm run start
```
### 빌드
```bash
 sudo npm run build
```

## Backend
### 사용 기술
- Nestjs
- MariaDB
- Passport
- Jwt

### 라이브러리 설치
```bash
 sudo npm install
```
### 실행
```bash
 sudo npm run start:dev
```
### 빌드
```bash
 sudo npm run build
```


## Crawling
### 사용 기술
- Python
- Django
- djangorestframwork
- BeautifulSoup4
- requests


### 라이브러리 설치
```bash
pip3 install BeautifulSoup4
pip3 install requests
pip3 install django
pip3 install djangorestframework
pip install JPype1
```

konlpy는 공식 홈페이지에 접속하여 환경에 맞게 설치
https://konlpy.org/ko/stable/install/

### 실행
8000번 port 사용
- 로컬 실행
```bash
python3 manage.py runserver
```

- 배포한 뒤 실행
```bash
python3 manage.py runserver 0.0.0.0:8000              
```
