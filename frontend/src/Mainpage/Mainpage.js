import React, {useState, useEffect, useRef} from 'react';
import styles from './Mainpage.module.css'; // CSS 모듈을 가져옵니다.
import Modal from '../Login/Modal.js';
import SignUpmodal from '../SignUp/SignUpmodal.js';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {keywordsApi, requestApi} from "../plugins/api-setting";
import {setAccessToken, setUserName} from "../store/user-slice";
import axios from "axios";
import {getCurrentDateTime} from "../plugins/date";
import Menubar from "../components/menubar";
import WordCloud from 'react-d3-cloud';

const words = [
    // 추가 단어들...
];

export default function Mainpage() {
    const [selectedCategory, setSelectedCategory] = useState('정치');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [wordFrequencies, setWordFrequencies] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const abortControllerRef = useRef(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const showSignUpModal = () => {
        setIsSignUpModalOpen(true);
        setIsLoginModalOpen(false);
    };

    const hideModals = () => {
        setIsLoginModalOpen(false);
        setIsSignUpModalOpen(false);
    };

    const reduxInfo = useSelector((state) => state.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        requestApi.post(`/user/logout`, {})
            .then(res => {
                // refreshToken 초기화는 DB에서
                // accessToken 초기화
                dispatch(setAccessToken(""));
                // userName 초기화
                dispatch(setUserName(""));
                navigate("/");
            })
            .catch(err => {
                console.log(err);
            });
    };

    const fetchData = async (category) => {
        if (abortControllerRef.current) {

            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        setError(null);
        const newsTypesConvert = [
            {text: '정치', en: 'politics'},
            {text: '경제', en: 'economy'},
            {text: '사회', en: 'society'},
            {text: '문화', en: 'culture'},
            {text: '국제', en: 'world'},
            {text: '스포츠', en: 'sport'},
            {text: 'IT/과학', en: 'science'},
            {text: '교육', en: 'education'},
            {text: '엔터테인먼트', en: 'enter'},
            {text: '인물', en: 'people'},
        ];
        const matchingType = newsTypesConvert.find(data => data.text === category);

        if (process.env.REACT_APP_CRAWLING_API_URL === "http://localhost:8000") {
            keywordsApi.get(`/news/`, {
                params: {
                    crawl_type: matchingType.en
                },
                signal: signal,
                withCredentials: true
            }).then(res => {
                const frequencyData = res.data.frequency;
                const formattedData = frequencyData.map(item => ({
                    text: item[0],
                    value: item[1]
                }));
                setWordFrequencies(formattedData);
                setLoading(false);
            }).catch(err => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    console.log(err);
                }
                setLoading(false);
            });
        } else {
            axios.get(`https://keywords.anhye0n.com/news`, {
                params: {
                    crawl_type: matchingType.en
                },
                signal: signal,
                withCredentials: true
            }).then(res => {
                const frequencyData = res.data.frequency;
                const formattedData = frequencyData.map(item => ({
                    text: item[0],
                    value: item[1]
                }));
                setWordFrequencies(formattedData);
                setLoading(false);
            }).catch(err => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    console.log(err);
                }
                setLoading(false);
            });
        }

    };

    useEffect(() => {
        fetchData(selectedCategory);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [selectedCategory]);

    useEffect(() => {
        fetchData('정치');

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div className={`${styles.app}`}>
            <Menubar setIsSignUpModalOpen={setIsSignUpModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}/>
            <div className={`${styles.content}`}>
                <div className={`${styles.keyword_header}`}>
                    <h2>오늘의 키워드</h2>
                </div>
                <div className={`${styles.keywordbox}`}></div>
                <p>분석 대상 뉴스 <span className={`${styles.news_count}`}> 8,360</span>건</p>
                <div className={`${styles.date}`}>{getCurrentDateTime()}</div>
                <div className={`${styles.categories_wrapper}`}>
                    <div className={`${styles.categories}`}>
                        {[
                            {label: '정치', icon: 'icon-politics.png'},
                            {label: '경제', icon: 'icon-economy.png'},
                            {label: '사회', icon: 'icon-society.png'},
                            {label: '문화', icon: 'icon-culture.png'},
                            {label: '국제', icon: 'icon-international.png'},
                            {label: '스포츠', icon: 'icon-sports.png'},
                            {label: 'IT/과학', icon: 'icon-science.png'},
                            {label: '교육', icon: 'icon-science.png'},
                            {label: '엔터테인먼트', icon: 'icon-science.png'},
                            {label: '인물', icon: 'icon-science.png'},
                        ].map((category) => (
                            <div
                                key={category.label}
                                className={`${styles.category} ${selectedCategory === category.label ? styles.selected : ''}`}
                                onClick={() => handleCategoryClick(category.label)}
                            >
                                <img src={`/img/${category.icon}`} alt={category.label}
                                     className={styles.categoryIcon}/>
                                <span>{category.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.info}`}>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error loading data.</p>
                        ) : (
                            <WordCloud
                                width={1740}
                                height={423}
                                font="Inter"
                                fontWeight="bold"
                                fontSize={(word) => Math.log2(word.value) * 20}
                                data={wordFrequencies}
                                padding={15}
                                rotate={0}
                            />
                        )}
                    </div>
                </div>
            </div>
            {isLoginModalOpen && <Modal onClose={hideModals} onSignUpClick={showSignUpModal}/>}
            {isSignUpModalOpen && <SignUpmodal onClose={hideModals}/>}
        </div>
    );
}
