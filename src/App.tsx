import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "assets/sass/common.scss";

import Login from "pages/login";
import Layout from "pages/Layout";
// import { Modal } from 'common/components/modal'
import loadable from "@loadable/component";
const FlyerList = loadable(() => import("pages/list"));

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
        <Route path="/oauth2/redirect/:jwtToken" element={<Login />} />
        <Route path="/index" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Navigate replace to="/index" />} />
          <Route path="/list" element={<FlyerList />} />
          <Route path="/register" element={<FlyerList />} />
          <Route path="/detail" element={<FlyerList />}>
            <Route path=":id" element={null} />
          </Route>
          <Route path="/update" element={<FlyerList />}>
            <Route path=":id" element={null} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
