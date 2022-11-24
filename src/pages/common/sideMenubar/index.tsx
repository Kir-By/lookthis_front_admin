import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { sideMenus, SIDE_MENU_TYPE } from "./data/SideMenu";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useLogin } from 'hooks/useLogin';
import { franState, loginState } from 'state';

import logo from 'assets/images/common/lookthis2.png'
type SideMenuBarType = {
    index : number,
    subIndex : number,
    show : boolean
}

const SideMenu:React.FC<{activeMenu:SideMenuBarType, sideMenus:Array<SIDE_MENU_TYPE>, setActiveMenu:React.Dispatch<React.SetStateAction<SideMenuBarType>>}> = ({activeMenu, sideMenus, setActiveMenu}) => {
    
    const handleMenuClick = (index:number, show?:boolean) => {
        setActiveMenu({ index : index,  subIndex : -1, show : show || !activeMenu.show})
    }

    const handleSubMenuClick = (subIndex:number) => {
        setActiveMenu({...activeMenu, subIndex : subIndex})
    }
    return (
        <ul className="menu-list">
            {
                sideMenus.map((data:SIDE_MENU_TYPE, key) => {
                    const childMenu = data.child?.map((subData, ckey) => 
                        <li key={`sublink_${ckey}`} className={`${activeMenu.subIndex === subData.id ? 'active' : ''}`}>
                            <Link to={data.path + subData.path} className="menu" onClick={() => handleSubMenuClick(subData.id)}>{subData.name}</Link>
                        </li>
                    );

                    const childLen = data.child?.length || 0
                    return (childLen > 0 ? 
                        <li key={`link_${key}`} className={`list-item depth ${activeMenu.index === data.id && activeMenu.show ? 'active' : ''}`}>
                            <span className="menu" onClick={() => handleMenuClick(data.id, data.id !== activeMenu.index) } >{data.name}</span>
                            <ul className="depth-list">
                                {childMenu}
                            </ul>
                        </li>
                        :
                        <li key={`link_${key}`} className={`list-item ${activeMenu.index === data.id ? 'active' : ''}`}>
                            <Link to={data.path} className="menu" onClick={() => handleMenuClick(data.id)}>{data.name}</Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}

const SideMenubar:React.FC = () => {
    const {logout} = useLogin()
    const loginInfo = useRecoilValue(loginState)
    const franCode = useRecoilValue(franState)
    const setFranCode = useSetRecoilState(franState)

    const [activeMenu, setActiveMenu] = useState<SideMenuBarType>({
        index: -1 ,
        subIndex : -1,
        show : false
    })
 
    // 메뉴활성화 처리.
    useEffect(() => {
        // URL로 바로 접속 시 side menu 처리.
        if( window.location.pathname !== "/"){
            let menuData:{pId : number, id : number} = { pId : 0, id : 0 };
            sideMenus.forEach((data:SIDE_MENU_TYPE) => {
                if(data.path === window.location.pathname) menuData = {...data, pId : data.id }
                else {
                    data.child?.forEach(cdata => {
                        if( (data.path + cdata.path) === window.location.pathname) menuData = {...cdata, pId : data.id, id : cdata.id } 
                    });
                }
            })
            setActiveMenu({index: menuData.pId, subIndex:menuData.id, show: menuData.id > 0 ? true : false})
        }
    // eslint-disable-next-line
    }, [window.location.pathname])

    // 로그아웃.
    const handleLogOut = useCallback(() => {
        const login_token = localStorage.getItem("login_token") !== null ? localStorage.getItem("login_token") : "";
        const params = {
            'sID' : "logout",
            'sPW' : "logout",
            'btoken' : 0,	         
            'sCToken' : login_token,       
            'sIP' : '@ip'
        }
        logout(params);
    }, [logout])

    // 매장 변경.
    const handleChargeFranCode = useCallback((e:ChangeEvent<HTMLSelectElement>) => {
        const selectfranCode = e.target.value
        let franCodeNum:number = 0
        if(!isNaN(Number(selectfranCode))){
            franCodeNum = Number(selectfranCode)
        }
        setFranCode(franCodeNum)
    }, [setFranCode])

    return(
        <nav>
            <img className="logo" src={logo} alt="" style={{width:146}} />
            <SideMenu activeMenu={activeMenu} sideMenus={sideMenus} setActiveMenu={setActiveMenu}/>
            {/* 로그아웃 */}
            <div className="user-function">
                <p><Link to={'#'} onClick={handleLogOut}>로그아웃</Link></p>
                <p><Link to={'#'}>비밀번호 변경</Link></p>
            </div>
        </nav>
    )
} 

export default SideMenubar