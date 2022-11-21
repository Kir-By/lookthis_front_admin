import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import 'assets/sass/common.scss';

import Login from 'pages/login';
import Layout from 'pages/Layout'
import { sideMenus as menuRoute, SIDE_MENU_TYPE } from "pages/common/sideMenubar/data/SideMenu";
// import { Modal } from 'common/components/modal'
import loadable from '@loadable/component';
const Board = loadable(() => import('pages/board'));

declare global {
    interface Window {
        //   Kakao: any;
        naver: any;
    }
}
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/index" element={<Login />} />;
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Navigate replace to="/index" />} />
                    <Route path="/list" element={<Board/>} />
                    <Route path="/register" element={<Board/>} />
                    <Route path="/detail" element={<Board/>} >
                        <Route path=":id" element={null} />
                    </Route>

                    {/* {menuRoute.map((data: SIDE_MENU_TYPE, key: number) => {
                        if (data?.child.length > 0) {
                            const sideRoute = data.child?.map((subData: Omit<SIDE_MENU_TYPE, 'child'>, subKey: number) => {
                                return subData.component ?
                                    <Route path={data.path + subData.path} element={<subData.component />} key={'sub_' + subKey} >
                                        {data.addPath.map((parameter, idx) => <Route path={parameter} element={null} key={idx} />)}
                                    </Route> : null
                            })
                            return sideRoute
                        } else {
                            return data.component ?
                                <Route path={data.path} element={<data.component />} key={key} >
                                    {data.addPath.map((parameter, idx) => <Route path={parameter} element={null} key={idx} />)}
                                </Route> : null
                        }
                    })} */}
                </Route>
            </Routes>
        </Router>
    )
}

export default App;
