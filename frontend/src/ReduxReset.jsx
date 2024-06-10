import {requestApi} from "./plugins/api-setting";
import {setAccessToken, setUserName} from "./store/user-slice";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function ReduxReset() {
    const reduxInfo = useSelector((state) => state.userInfo)

    const navigate = useNavigate()
    const dispatch = useDispatch()

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

    useEffect(() => {
        logout();
    }, []);

    return (
        <div></div>
    );
}

export default ReduxReset;