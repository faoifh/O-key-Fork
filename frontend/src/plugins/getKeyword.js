import {stopwords} from "./stopwords";

// 기사의 제목들을 가져와서 줄 단위로 분리
const titles = document.getElementById('titles').value.split('\n');

// 단어 빈도수를 저장할 객체
const wordFrequency = {};

titles.forEach(title => {
    // 제목을 소문자로 변환하고, 특수문자를 제거한 후 공백으로 토큰화
    const words = title.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').split(/\s+/);

    words.forEach(word => {
        if (!stopwords.includes(word) && word) {
            if (wordFrequency[word]) {
                wordFrequency[word]++;
            } else {
                wordFrequency[word] = 1;
            }
        }
    });
});

// 빈도수가 높은 순으로 정렬
const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);

// 결과 출력
const keywordsDiv = document.getElementById('keywords');
keywordsDiv.innerHTML = '';
sortedWords.forEach(word => {
    const p = document.createElement('p');
    p.textContent = `${word}: ${wordFrequency[word]}`;
    keywordsDiv.appendChild(p);
});