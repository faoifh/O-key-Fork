import React, { useEffect, useState } from 'react';
import styles from './Interest_news.module.css';
import Menubar from "../components/menubar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { keywordsApi } from "../plugins/api-setting";
import axios from "axios";
import { setInterests } from "../store/user-slice";

export default function Interest_news() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const [keywords, setKeywords] = useState([
        { id: 1, text: '정치', checked: false },
        { id: 2, text: '경제', checked: false },
        { id: 3, text: '사회', checked: false },
        { id: 4, text: '문화', checked: false },
        { id: 5, text: '국제', checked: false },
        { id: 7, text: '스포츠', checked: false },
        { id: 8, text: 'IT/과학', checked: false },
        { id: 9, text: '교육', checked: false },
        { id: 10, text: '엔터테인먼트', checked: false },
        { id: 11, text: '인물', checked: false },
    ]);
    const reduxInfo = useSelector((state) => state.userInfo);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!reduxInfo.userName) {
            alert("로그인이 되어있지않습니다.");
            navigate("/");
        }

        const updatedKeywords = keywords.map(keyword =>
            reduxInfo.interests.includes(keyword.text) ? { ...keyword, checked: true } : keyword
        );

        setKeywords(updatedKeywords);
    }, [reduxInfo, navigate]);

    const handleCheckboxChange = async (id) => {
        const updatedKeywords = keywords.map((keyword) =>
            keyword.id === id ? { ...keyword, checked: !keyword.checked } : keyword
        );
        setKeywords(updatedKeywords);

        const newInterests = updatedKeywords
            .filter((keyword) => keyword.checked)
            .map((keyword) => keyword.text);
        dispatch(setInterests(newInterests));
    };

    function Article({ interest }) {
        const [news, setNews] = useState([]);
        const [loading, setLoading] = useState(false);

        const newsTypesConvert = [
            { text: '정치', en: 'politics' },
            { text: '경제', en: 'economy' },
            { text: '사회', en: 'society' },
            { text: '문화', en: 'culture' },
            { text: '국제', en: 'world' },
            { text: '스포츠', en: 'sport' },
            { text: 'IT/과학', en: 'science' },
            { text: '교육', en: 'education' },
            { text: '엔터테인먼트', en: 'enter' },
            { text: '인물', en: 'people' },
        ];
        const matchingType = newsTypesConvert.find(data => data.text === interest);

        useEffect(() => {
            if (matchingType) {
                setLoading(true);
                if (process.env.REACT_APP_CRAWLING_API_URL === "http://localhost:8000") {
                    keywordsApi.get(`/news/`, {
                        params: {
                            crawl_type: matchingType.en
                        },
                        withCredentials: true
                    }).then(res => {
                        setNews(res.data.data || []);
                        setLoading(false);
                    }).catch(err => {
                        console.log(err);
                        setLoading(false);
                    });
                } else {
                    axios.get(`https://keywords.anhye0n.com/news`, {
                        params: {
                            crawl_type: matchingType.en
                        },
                        withCredentials: true
                    }).then(res => {
                        setNews(res.data.data || []);
                        setLoading(false);
                    }).catch(err => {
                        console.log(err);
                        setLoading(false);
                    });
                }
            }
        }, [matchingType]);

        return (
            <div>
                <h1>{interest}</h1>
                <div className={styles['article-container']}>
                    {loading ? (
                        <div className={styles.loader}></div>
                    ) : (
                        news.map(data => (
                            <div className={styles['article']} key={data.id} onClick={() => {
                                window.open(data.url, "_blank");
                            }}>
                                <h1>{data.title}</h1>
                                <p className={styles['article-company']}>{data.company}</p>
                                <hr />
                                <p>{data.content.length > 300 ? `${data.content.substring(0, 300)}...` : data.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.app}`}>
            <Menubar setIsSignUpModalOpen={setIsSignUpModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} />
            <div className={`${styles.content}`}>
                <div className={`${styles.contentwrapper}`}>
                    <div className={`${styles.keyword_header}`}>
                        <h2>내 관심 뉴스</h2>
                        <div className={`${styles.keyword_setting}`}>
                            <button className={`${styles.settingbtn}`}>맞춤형 키워드 설정</button>
                        </div>
                    </div>
                    <div className={`${styles.keywordbox}`}></div>
                    <p className={styles['interests-keywords']}>관심 키워드</p>
                    <div className={`${styles.checkboxContainer}`}>
                        {keywords.map((keyword) => (
                            <label className={styles.checkboxLabel} key={keyword.id}>
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
                <div className={styles['contents-container']}>
                    {reduxInfo.interests.map(data => <Article interest={data} key={data} />)}
                </div>
            </div>
        </div>
    );
}
