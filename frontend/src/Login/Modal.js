import React, { useState } from 'react';
import styles from './Modal.module.css';

function Modal({ onClose }) {
    const [modal, setModal] = useState(false);

    const hideModal = () => {
        setModal(false);
    };

    return (
        <div>
            <div className={`${styles.modal_container}`}>
                <div className={`${styles.modal_content}`}>
                    <div className={`${styles.modal_header}`}>
                        <button onClick={onClose} className={`${styles.closebtn}`}>✖</button>
                    </div>
                    <div className={`${styles.modal_logo}`}>O-key</div>
                    <div className={`${styles.modalinputWrap}`}>
                        <div className={`${styles.inputemail}`}>
                            <p>E-mail</p>
                            <input className={`${styles.input_info}`} placeholder="이메일을 입력하세요." />
                        </div>
                        <div className={`${styles.inputpw}`}>
                            <p>Password</p>
                            <input className={`${styles.input_info}`} placeholder="비밀번호를 입력하세요." />
                        </div>
                    </div>
                    <div className={`${styles.signin}`}>
                        <button className={`${styles.signinbtn}`}>로그인</button>
                    </div>
                    <div className={`${styles.signup}`}>
                        <button className={`${styles.signupbtn}`}>회원가입</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;