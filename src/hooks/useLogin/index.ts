import { useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import LOGIN_SERVICE from 'service/loginService';

// Global State
import { loginState, franState } from 'state'

// 로그인 hooks
export const useLogin = () => {
    const navigate = useNavigate()
    const setLoginAuth = useSetRecoilState(loginState)
    const setFranCode = useSetRecoilState(franState)
   
    // 로그인 Mutation
    const loginMutation = LOGIN_SERVICE.useLogin(
        (error: any) => {
            console.log("로그인 오류", error)
        },
        (result: any, variables : any) => {
            if (result?.out?.sError === '' && result?.out?.nFCode !== -1){
                if(result?.out?.sToken !== null) setToken(result?.out?.sToken);
                localStorage.setItem("userID", result?.out?.sLoginID);
                localStorage.setItem("userNm", result?.out?.sName);
                localStorage.setItem("userNo", result?.out?.nSNo);

                setLoginAuth({
                    isLogin : true,
                    userInfo : {
                        staff_no : result?.out?.nSNo,
                        staff_name : result?.out?.sName,
                        login_id : result?.out?.sLoginID,
                        f_list : result?.list
                    }
                })

                if(result?.list.length > 0) setFranCode(result?.list[0].f_code|0)
                if(window.location.pathname === '/index') navigate("/home");
            }else{
                removeToken()
                setFranCode(0)
                localStorage.removeItem("sUserID")
                alert(result?.out?.sError);
            }
        }
    );

    // 로그아웃 Mutation
    const logoutMutation = LOGIN_SERVICE.useLogout(
        (error: any) => {
            console.log("로그아웃 오류", error)
        },
        (result: any) => {
            removeToken()
            setLoginAuth({
                isLogin : false,
                userInfo : {
                    staff_no : result?.out?.nSNo,
                    staff_name : result?.out?.sName,
                    login_id : result?.out?.sLoginID,
                    f_list : result?.list
                }
            })
            setFranCode(0)
            navigate("/");
        }
    );

    const login = (params:any) => {
        loginMutation.mutate(params);
    }

    const logout = (params:any) => {
        logoutMutation.mutate(params);
    }

    const setToken = (sToken:string) => {
        sessionStorage.setItem("login_token", sToken);
    }

    const removeToken = () => {
        sessionStorage.removeItem("login_token");
        localStorage.removeItem("userID");
        localStorage.removeItem("userNm");
        localStorage.removeItem("userNo");
    }

    const chkToken = () => {
        if(sessionStorage.getItem("login_token") === null || sessionStorage.getItem("login_token") === "null" || sessionStorage.getItem("login_token") === "") {
            return false;	    			
        } else {
            return true;
        } 
    }

    const getToken = () => {
        return sessionStorage.getItem("login_token");
    }

    return { login, logout, chkToken, getToken, removeToken }
}
