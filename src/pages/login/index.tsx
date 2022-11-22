import { useSetRecoilState } from 'recoil'
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Utils from "utils/Utils";

import { useLogin } from "hooks/useLogin";
import { useEventKeyCode } from "hooks/useEventKeyCode";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { userInfo } from 'state';
import img from 'assets/images/common/lookthis2.png'

const Login: React.FC = () => {

  const { jwtToken } = useParams();
  const navigation = useNavigate();
  const setUserInfo = useSetRecoilState(userInfo);
  useEffect(() => {

    if(jwtToken) {
        const useInfo:any = jwt_decode(jwtToken);
        sessionStorage.setItem('userId', useInfo.userId);
        setUserInfo(useInfo.userId);
        navigation('/list');
    }
    
  }, [jwtToken]);

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
              {/* <input style={{opacity:0}} disabled className="input login" type="text" placeholder="아이디" name="loginID" value={loginInfo.loginID} onChange={handleChangeData} /> */}
              {/* <input style={{opacity:0}} className="input password" type="password" placeholder="비밀번호" name="loginPW" value={loginInfo.loginPW} onChange={handleChangeData}/> */}

              <button className="link_login">
                <a
                  href="http://lookthis-back.nhncloud.paas-ta.com/oauth2/authorization/naver"
                  data-clk="log_off.login"
                >
                  <i className="ico_naver">
                    <span className="blind">네이버 </span>
                  </i>
                  로그인
                </a>
              </button>
              {/* <button style={{opacity:0}} className="btn-cta" onClick={handleLogin}>로그인</button> */}
            </section>
          </div>
        </section>
      )}
    </article>
  );
};

export default Login;
