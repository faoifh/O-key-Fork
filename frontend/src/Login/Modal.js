import React, {useState} from 'react';
import styles from './Modal.module.css';
import requestApi from "../plugins/api-setting";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setAccessToken, setUserName} from "../store/user-slice";

function Modal({onClose, onSignUpClick}) {

    const [loginInfo, setLoginInfo] = useState({
        id: "",
        password: ""
    })
    const dispatch = useDispatch()

    const navigate = useNavigate()


    const login = () => {
        requestApi.post("/user/login", {
            id: loginInfo.id,
            password: loginInfo.password,
        }).then(res => {
            console.log(res)

            dispatch(setAccessToken(res.headers["authorization"].replace("Bearer ", "")))
            dispatch(setUserName(res.data))

            onClose();
            navigate("/")
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className={styles.modal_container}>
            <div className={styles.modal_content}>
                <div className={styles.modal_header}>
                    <button onClick={onClose} className={styles.closebtn}>✖</button>
                </div>
                <div className={styles.modal_logo}>O-key</div>
                <div className={styles.modalinputWrap}>
                    <div className={styles.inputemail}>
                        <p>E-mail</p>
                        <input className={styles.input_info} placeholder="이메일을 입력하세요." value={loginInfo.id}
                               onChange={e => setLoginInfo({
                                   ...loginInfo,
                                   id: e.target.value
                               })}/>
                    </div>
                    <div className={styles.inputpw}>
                        <p>Password</p>
                        <input
                            type="password"
                            className={styles.input_info} placeholder="비밀번호를 입력하세요." value={loginInfo.password}
                            onChange={e => setLoginInfo({
                                ...loginInfo,
                                password: e.target.value
                            })}
                        />
                    </div>
                </div>
                <div className={styles.signin}>
                    <button className={styles.signinbtn} onClick={login}>로그인</button>
                </div>
                <div className={styles.signup}>
                    <button onClick={onSignUpClick} className={styles.signupbtn}>회원가입</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
