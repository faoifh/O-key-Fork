import styles from "../Mainpage/Mainpage.module.css";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import requestApi from "../plugins/api-setting";
import {setAccessToken, setUserName} from "../store/user-slice";

function Menubar({setIsSignUpModalOpen, setIsLoginModalOpen}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const showLoginModal = () => {
        setIsLoginModalOpen(true);
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
        <div className={`${styles.navbar}`}>
            <div className={`${styles.logo}`} onClick={() => navigate("/")}>O-key</div>
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
    );
}

export default Menubar;