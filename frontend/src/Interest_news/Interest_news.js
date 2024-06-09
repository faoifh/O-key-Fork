import React, { useState } from 'react';
import styles from './Interest_news.module.css'; // CSS 모듈을 가져옵니다.


export default function Interest_news() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [keywords, setKeywords] = useState([
        { id: 1, text: '정치', checked: false },
        { id: 2, text: '경제', checked: false },
        { id: 3, text: '사회', checked: false },
        { id: 4, text: '문화', checked: false },
        { id: 5, text: '국제', checked: false },
        { id: 6, text: '지역', checked: false },
        { id: 7, text: '스포츠', checked: false },
        { id: 8, text: 'IT/과학', checked: false },
    ]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleCheckboxChange = (id) => {
        setKeywords((prevKeywords) =>
            prevKeywords.map((keyword) =>
                keyword.id === id ? { ...keyword, checked: !keyword.checked } : keyword
            )
        );
    };

    return (
        <div className={`${styles.app}`}>
            <div className={`${styles.navbar}`}>
                <div className={`${styles.logo}`}>O-key</div>
                <div className={`${styles.search_bar}`}>
                    <input type="text" placeholder="검색어를 입력해주세요." />
                    <button type="button">
                        <img src="/img/icon-search.png" alt="Search" />
                    </button>
                </div>
                <div className={`${styles.dropdownwrapper}`}>
                    <button className={`${styles.dropdown}`} onClick={toggleDropdown}>6. 토트넘 vs...
                    </button>
                    {isOpen && (
                        <div className={styles.dropdownContent}>
                            <p>콘텐츠 1</p>
                            <p>콘텐츠 2</p>
                            <p>콘텐츠 3</p>
                        </div>
                    )}
                </div>
                <div className={`${styles.login}`}>
                    <button className={`${styles.loginbtn}`}>김도윤</button>
                </div>
            </div>
            <div className={`${styles.content}`}>
                <div className={`${styles.contentwrapper}`}>
                    <div className={`${styles.keyword_header}`}>
                        <h2>내 관심 뉴스</h2>
                        <div className={`${styles.keyword_setting}`}>
                            <button className={`${styles.settingbtn}`}>맞춤형 키워드 설정</button> 
                        </div>
                    </div>
                    <div className={`${styles.keywordbox}`}></div>
                    <p>관심 키워드</p>
                    <div className={`${styles.checkboxContainer}`}>
                        {keywords.map((keyword) => (
                            <label key={keyword.id} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={keyword.checked}
                                    onChange={() => handleCheckboxChange(keyword.id)}
                                />
                                {keyword.text}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
