import { useSetRecoilState } from 'recoil'
import { ChangeEventHandler, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { userInfo } from 'state';
import img from 'assets/images/common/lookthis2.png'
import Axios from 'utils/Axios';

const Login: React.FC = () => {

  const navigation = useNavigate();
  const setUserInfo = useSetRecoilState(userInfo);
  
  // OAuth Login
  const { jwtToken } = useParams();
  
  useEffect(() => {

    if(jwtToken) {
        const useInfo:any = jwt_decode(jwtToken);
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

    const axiosConfig = {
      headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json; charset=UTF-8',
          // Authorization: 'Bearer ' + jwt,
      },
    };
    const res = await Axios.post(
      "https://lookthis-back.nhncloud.paas-ta.com/login/doLogin",
      JSON.stringify(loginInfo), axiosConfig
    );

    console.log(res);
  };

  return (
    <article>
      {!jwtToken && (
        <section className="login-widget">
          <div
            className="inner"
            style={{ justifyContent: "center", minHeight: "450px" }}
          >
            <div>
              <img src={img} alt="" style={{width:'350px', marginTop:'-100px', marginBottom:'20pxs'}}/>
            </div>
            <section className="input-wrap">
              <input className="input login" type="text" placeholder="아이디" name="userId" value={loginInfo.userId} onChange={handleLoginInfo} />
              <input className="input password" type="password" placeholder="비밀번호" name="password" value={loginInfo.password} onChange={handleLoginInfo} autoComplete={"off"} />
              <button className="btn-cta" onClick={handleLogin}>로그인</button>
              <button className="link_login" style={{marginTop: '10px'}}>
                <a
                  href="http://lookthis-back.nhncloud.paas-ta.com/oauth2/authorization/naver2"
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
