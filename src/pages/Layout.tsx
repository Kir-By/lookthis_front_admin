import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useLogin } from 'hooks/useLogin';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { loginState, userInfo } from 'state';
import SideMenubar from 'pages/common/sideMenubar';

const Layout: React.FC = () => {
    const navigate = useNavigate()
    const loginInfo = useRecoilValue(loginState)
    const { login, chkToken, getToken, removeToken } = useLogin()

    const setUserInfo = useSetRecoilState(userInfo);
    const userId = sessionStorage.getItem("userId");
    const jwt = sessionStorage.getItem("jwt");
    useEffect(() => {
      if(userId && jwt) setUserInfo({userId, jwt});
    }, [userId, jwt, setUserInfo]);
    // 새로고침 로그인 처리.
    const loginCheck = async () => {
        if (!loginInfo.isLogin) {
            if (chkToken()) {
                try {
                    const params = {
                        sID: "",
                        sPW: "",
                        btoken: 0,
                        sCToken: getToken(),
                        sIP: "@ip",
                    }
                    login(params)
                } catch (e) {
                    removeToken()
                    navigate("/")
                }
            } else {
                removeToken()
                navigate("/")
            }
        }
    }

    // // 로그인 체크.
    // useEffect(() => {
    //     loginCheck()
    // }, [])

    return (
        <article>
            <SideMenubar />
            <Outlet />
        </article>
    )
}

export default Layout;