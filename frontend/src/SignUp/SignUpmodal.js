import React, {useState} from 'react';
import styles from './SignUpmodal.module.css';

import {requestApi} from "../plugins/api-setting";
import {isEmpty, isValidEmail} from "../plugins/validators";
import {useNavigate} from "react-router-dom";
import {setAccessToken, setUserName} from "../store/user-slice";
import {useDispatch, useSelector} from "react-redux";

function SignUpmodal({onClose}) {

    const navigate = useNavigate()

    const [keywords, setKeywords] = useState([
        {id: 1, text: '정치', checked: false},
        {id: 2, text: '경제', checked: false},
        {id: 3, text: '사회', checked: false},
        {id: 4, text: '문화', checked: false},
        {id: 5, text: '국제', checked: false},
        {id: 6, text: '지역', checked: false},
        {id: 7, text: '스포츠', checked: false},
        {id: 8, text: 'IT/과학', checked: false},
    ]);

    const [signUpInfo, setSignUpInfo] = useState({
        name: "",
        id: "",
        password: "",
    })

    const handleCheckboxChange = (id) => {
        setKeywords((prevKeywords) =>
            prevKeywords.map((keyword) =>
                keyword.id === id ? {...keyword, checked: !keyword.checked} : keyword
            )
        );
    };

    // 회원가입
    const signUp = () => {
        if (isEmpty(signUpInfo.id) || isEmpty(signUpInfo.name) || isEmpty(signUpInfo.password)) {
            alert("값을 입력해주시길 바랍니다.")
            return
        }

        if (!isValidEmail(signUpInfo.id)) {
            alert("이메일 형식이 맞지 않습니다.")
            return
        }

        if (keywords
            .filter(keyword => keyword.checked)
            .map(keyword => keyword.text).length === 0
        ) {
            alert("관심 분야를 최소 1개 설정해야합니다.")
            return
        }

        requestApi.post("user/register", {
            id: signUpInfo.id,
            name: signUpInfo.name,
            password: signUpInfo.password,
            interests: keywords
                .filter(keyword => keyword.checked)
                .map(keyword => keyword.text)
                .toString()
        }).then(res => {
            console.log(res)
            alert("회원가입이 완료되었습니다.")
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
                    <div className={styles.inputname}>
                        <p>NAME</p>
                        <input
                            type="text"
                            className={styles.input_info}
                            placeholder="이름을 입력하세요."
                            value={signUpInfo.name}
                            onChange={e => setSignUpInfo({
                                ...signUpInfo,
                                name: e.target.value
                            })}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    signUp()
                                }
                            }}
                        />
                    </div>
                    <div className={styles.inputemail}>
                        <p>E-mail</p>
                        <input
                            type="email"
                            className={styles.input_info} placeholder="사용할 이메일을 입력하세요."
                            value={signUpInfo.id}
                            onChange={e => setSignUpInfo({
                                ...signUpInfo,
                                id: e.target.value
                            })}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    signUp()
                                }
                            }}
                        />
                    </div>
                    <div className={styles.inputpw}>
                        <p>Password</p>
                        <input
                            type="password"
                            className={styles.input_info} placeholder="사용할 비밀번호를 입력하세요."
                            value={signUpInfo.password}
                            onChange={e => setSignUpInfo({
                                ...signUpInfo,
                                password: e.target.value
                            })}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    signUp()
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={styles.checkboxWrap}>
                    <div className={styles.checkboxContent}>
                        <p>관심분야 선택</p>
                        <div className={styles.checkboxContainer}>
                            {keywords.map((keyword) => (
                                <label key={keyword.id} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={keyword.checked}
                                        onChange={() => handleCheckboxChange(keyword.id)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                signUp()
                                            }
                                        }}
                                    />
                                    {keyword.text}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.signup}>
                    <button className={styles.signupbtn} onClick={signUp}>회원가입</button>
                </div>
            </div>
        </div>
    );
}

export default SignUpmodal;
