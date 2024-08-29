import { useSetRecoilState } from 'recoil'
import { ChangeEventHandler, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { userInfo } from 'state';
import img from 'assets/images/common/lookthis2.png'
import Axios from 'utils/Axios';
import { useEventKeyCode } from 'hooks/useEventKeyCode';

const Login: React.FC = () => {

  const navigation = useNavigate();
  const setUserInfo = useSetRecoilState(userInfo);

  // OAuth Login
  const { jwtToken } = useParams();

  useEffect(() => {

    if (jwtToken) {
      const useInfo: any = jwt_decode(jwtToken);
      sessionStorage.setItem('userId', useInfo.userId);
      sessionStorage.setItem('jwt', jwtToken);
      setUserInfo({ userId: useInfo.userId, jwt: jwtToken });
      navigation('/list');
    }

  }, [jwtToken]);

  // 일반 Login
  const [loginInfo, setLoginInfo] = useState({
    userId: '',
    password: '',
  });

  const handleLoginInfo: ChangeEventHandler<HTMLInputElement> = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setLoginInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {

    if (Object.values(loginInfo).filter(item => !item).length > 0) return alert('로그인 정보를 입력하세요');

    const formObj = new FormData();
    formObj.append('userId', loginInfo.userId);
    formObj.append('password', loginInfo.password);

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json; charset=UTF-8',
      },
    };

    try {
      const loginUrl = await Axios.post(
        "https://lookthis.co.kr/api/login/doLogin",
        formObj, axiosConfig
      );
      navigation(loginUrl);
    }
    catch (error:any) {
      // console.log('error', error);
      // console.log('error1', error.response.status);

      // if(error.response.status === 404) {
      //   const loginUrl = '/oauth2/redirect/';
      //   // console.log('error2', error.request.responseURL.split(loginUrl));
      //   const loginPath = error.request.responseURL.split(loginUrl)[1];
      //   navigation(loginUrl + loginPath);
      // };
    }
   
  };

  useEventKeyCode(handleLogin, 'Enter');

  return (
    <article>
      {!jwtToken && (
        <section className="login-widget">
          <div
            className="inner"
            style={{ justifyContent: "center", minHeight: "450px" }}
          >
            <div>
              <img src={img} alt="" style={{ width: '350px', marginTop: '-100px', marginBottom: '20pxs' }} />
            </div>
            <section className="input-wrap">
              <input className="input login" type="text" placeholder="아이디" name="userId" value={loginInfo.userId} onChange={handleLoginInfo} />
              <input className="input password" type="password" placeholder="비밀번호" name="password" value={loginInfo.password} onChange={handleLoginInfo} autoComplete={"off"} />
              <button className="btn-cta" onClick={handleLogin}>로그인</button>
              <button className="link_login" style={{ marginTop: '10px' }}>
                <a
                  href="https://lookthis.co.kr/api/oauth2/authorization/naver2"
                  data-clk="log_off.login"
                >
                  <i className="ico_naver">
                    <span className="blind">네이버 </span>
                  </i>
                  로그인
                </a>
              </button>
            </section>
          </div>
        </section>
      )}
    </article>
  );
};

export default Login;
