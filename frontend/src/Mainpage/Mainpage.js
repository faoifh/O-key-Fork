import React, {useState} from 'react';
import styles from './Mainpage.module.css'; // CSS 모듈을 가져옵니다.
import Modal from '../Login/Modal.js';
import SignUpmodal from '../SignUp/SignUpmodal.js';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import requestApi from "../plugins/api-setting";
import {setAccessToken, setUserName} from "../store/user-slice";
import {post} from "axios";
import {getCurrentDateTime} from "../plugins/date";

const words = [
    // 추가 단어들...
];

export default function Mainpage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const showLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsSignUpModalOpen(false);
    };

    const showSignUpModal = () => {
        setIsSignUpModalOpen(true);
        setIsLoginModalOpen(false);
    };

    const hideModals = () => {
        setIsLoginModalOpen(false);
        setIsSignUpModalOpen(false);
    };


    const reduxInfo = useSelector((state) => state.userInfo)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const logout = () => {
        requestApi.post(`/user/logout`, {})
            .then(res => {

                // refreshToken 초기화는 DB에서
                // accessToken 초기화
                dispatch(setAccessToken(""))

                // userName 초기화
                dispatch(setUserName(""))

                navigate("/")

            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className={`${styles.app}`}>
            <div className={`${styles.navbar}`}>
                <div className={`${styles.logo}`}>O-key</div>
                <div className={`${styles.search_bar}`}>
                    <input type="text" placeholder="검색어를 입력해주세요."/>
                    <button type="button">
                        <img src="/img/icon-search.png" alt="Search"/>
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
                    {reduxInfo.userName
                        ?
                        <>
                            <p>{reduxInfo.userName}</p>
                            <p onClick={logout} className={`${styles.logoutbtn}`}>로그아웃</p>
                        </>
                        :
                        <button onClick={showLoginModal} className={`${styles.loginbtn}`}>로그인</button>
                    }
                </div>
            </div>

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
                            {label: '전체', icon: 'icon-all.png'},
                            {label: '정치', icon: 'icon-politics.png'},
                            {label: '경제', icon: 'icon-economy.png'},
                            {label: '사회', icon: 'icon-society.png'},
                            {label: '문화', icon: 'icon-culture.png'},
                            {label: '국제', icon: 'icon-international.png'},
                            {label: '지역', icon: 'icon-local.png'},
                            {label: '스포츠', icon: 'icon-sports.png'},
                            {label: 'IT/과학', icon: 'icon-science.png'}
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
                        <div className={`${styles.info_tags}`}>
                            <span className={`${styles.tag1} ${styles.personTag}`}>● 인물</span>
                            <span className={`${styles.tag2} ${styles.placeTag}`}>● 장소</span>
                            <span className={`${styles.tag3} ${styles.institutionTag}`}>● 기관</span>
                        </div>
                    </div>
                </div>
            </div>
            {isLoginModalOpen && <Modal onClose={hideModals} onSignUpClick={showSignUpModal}/>}
            {isSignUpModalOpen && <SignUpmodal onClose={hideModals}/>}
        </div>
    );
}
