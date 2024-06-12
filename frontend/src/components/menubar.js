import styles from "../Mainpage/Mainpage.module.css";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {requestApi} from "../plugins/api-setting";
import {setAccessToken, setUserName} from "../store/user-slice";

function Menubar({setIsSignUpModalOpen, setIsLoginModalOpen}) {
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
            <div className={`${styles.login}`}>
                {reduxInfo.userName
                    ?
                    <>
                        <div className={`${styles.interestnews}`}>
                            <button className={`${styles.interestbtn}`} onClick={() => navigate("/interest_news")}>내 관심 뉴스 보기</button>
                        </div>
                        <div className={`${styles.userinfo}`}>{reduxInfo.userName}</div>
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