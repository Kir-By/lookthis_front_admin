import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Utils from 'utils/Utils';

import { useLogin } from 'hooks/useLogin';
import { useEventKeyCode } from 'hooks/useEventKeyCode';

type LoginInfoType = {
    loginID : string,
    loginPW : string,
    authNumber : string,
    btoken : boolean,
    sCToken : string,
    chkSaveID : boolean
}

const Login:React.FC = () => {
    const {login} = useLogin()

    const [loginInfo, setLoginInfo] = useState<LoginInfoType>({
        loginID : "",
        loginPW : "",
        authNumber : "",
        btoken : true,
        sCToken : "",
        chkSaveID : false
    })

    // 아이디 저장표시.
    useEffect(() => {
        const saveID = localStorage.getItem("sUserID")||"";
        console.log(saveID)
        if(saveID !== ""){
            setLoginInfo({...loginInfo, loginID : saveID, chkSaveID : true})
        }
        //토큰값이 있는경우 자동로그인 시도
        if(Utils.chkToken() === true) {	 
            // const params = {
            //     sID : "",
            //     sPW : "",
            //     btoken : 0,	       
            //     sCToken : Utils.getToken(),
            //     sIP : "@ip",
            // }
            // login(params)
        }
    },[])

    // 데이터 변경.
    const handleChangeData = (e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.name === "chkSaveID"){
            setLoginInfo({...loginInfo, [e.target.name] : e.target.checked})
        }else{
            setLoginInfo({...loginInfo, [e.target.name] : e.target.value})
        }
    }

    // 로그인 처리.
    const handleLogin = useCallback(() => {
        const { loginID, loginPW, chkSaveID } = loginInfo
        if(loginID === ''){
            alert("아이디를 입력해 주세요.")
            return false
        }else if(loginPW === ''){
            alert("비밀번호를 입력해 주세요.")
            return false
        }

        // 아이디 저장.
        if(chkSaveID) localStorage.setItem("sUserID", loginID)
        else localStorage.removeItem("sUserID")
        
        const params = {
            'sID' : loginInfo.loginID,
            'sPW' : loginInfo.loginPW,
            'btoken' : loginInfo.btoken, // 1이면 토큰값 생성 및 저장 (자동로그인)
            'sCToken' : '',              // 브라우저에 저장된 토큰값
            'sIP' : '@ip'
        }
        login(params)
    }, [login, loginInfo])

    useEventKeyCode(handleLogin, 'Enter');

    return (
        <article>
            <section className="login-widget">
                <div className="inner">
                    <div className="login-logo">
                        <p className="prologue">바나프레소 가맹점 사이트에 오신것을 환영합니다.</p>
                    </div>
                    <section className="input-wrap">
                        <input className="input login" type="text" placeholder="전화번호" name="loginID" value={loginInfo.loginID} onChange={handleChangeData} />
                        <input className="input password" type="password" placeholder="비밀번호" name="loginPW" value={loginInfo.loginPW} onChange={handleChangeData}/>
                        <div className="sub-wrap">
                            <div className="id-storage">
                                <input className="check" type="checkbox" name="chkSaveID" id="id" onChange={handleChangeData} checked={loginInfo.chkSaveID}/>
                                <label htmlFor="id">아이디 저장</label>
                            </div>
                            <button className="password-modify">비밀번호 재설정</button>
                        </div>
                        <button className="btn-cta" onClick={handleLogin}>로그인</button>
                    </section>
                </div>
                <div className="info">
                    <div className="policy">
                        <p>* 회원님의 정보보호를 위하여 20분 이상 자리를 비우실 경우 자동으로 로그아웃 됩니다.</p>
                        <p>* 아이디(전화번호) 변경 등 로그인 계정 관련 문의는 본사 담당자에게 연락 바랍니다.</p>
                    </div>
                    <div className="copyright">
                        <strong>주식회사 바나플에프엔비</strong>
                        <p>주소: 서울특별시 강남구 테헤란로 81길 9 (삼성동, 바나플빌딩) 3층</p>
                        <p>대표전화: 1811-1111  Fax: 070-4512-0296 이메일: master@banapresso.com</p>
                        <p>© banaple F&B. All Rights Reserved.</p>
                    </div>
                </div>
            </section>
        </article>
    )
}

export default Login;