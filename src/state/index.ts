import { atom } from 'recoil'

type UserInfoType = {
    staff_no : number,
    staff_name : string, 
    login_id : string,
    f_list : Array<any>
}

type LoginAuthType = {
    isLogin : boolean,
    userInfo : UserInfoType
}

const loginState = atom<LoginAuthType>({
    key: 'loginAuth',
    default: {
        isLogin : false,
        userInfo : {
            staff_no : -1,
            staff_name : '', 
            login_id : '',
            f_list : []
        }
    },
})

const franState = atom<number>({
    key: 'franCode',
    default : 0
})

const userInfo = atom<{userId:string, jwt:string}>({
    key: 'userInfo',
    default : {
        userId:'',
        jwt:'',
    }
})
type UserInfo = {userId:string, jwt:string};

export { loginState, franState, userInfo }
export type { LoginAuthType, UserInfo }
