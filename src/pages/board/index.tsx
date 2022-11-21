import { FC, useEffect, useState } from "react";

// component
import { useNavigate } from "react-router-dom";
import loadable from '@loadable/component';
const FlyerList = loadable(() => import('pages/board/component/FlyerList'));
const FlyerDetail = loadable(() => import('pages/board/component/FlyerDetail'));
const RegisterFlyer = loadable(() => import('pages/board/component/RegisterFlyer'));

const BoardContainer: FC = () => {

  const navigation = useNavigate();
  const [status, setStatus] = useState<BoardStatus>(BOARD_STATUS.LIST);
  const pathName = window.location.pathname;
  useEffect(() => {
    setStatus(prev => pathName as BoardStatus);
  },[pathName]);

  const setComponent = () => {
    if (status === BOARD_STATUS.LIST) return <FlyerList />;
    else if (status === BOARD_STATUS.REGISTER) return <RegisterFlyer />;
    else if (status.includes(BOARD_STATUS.DETAIL)) return <FlyerDetail />;
  };

  return (
    <>
      <section className="container">
        <header>
          <div className="page-title home">
            <p className="present"> HOME </p>
          </div>
        </header>
        <section
          className={`contents-wrap ${
            status === BOARD_STATUS.LIST ? `notice-wrap` : "notice-view-wrap"
          }`}
        >
          {/* <section className={`contents-wrap notice-wrap`}> */}
          {/* <section className="contents-wrap notice-view-wrap"> */}
          <div className="contents">
            <div className="tab-wrap" style={{ border: "0px" }}>
              <button
                style={{
                  padding: "12px 10px",
                  color: "#fff",
                  borderRadius: "4px",
                  background: "#f1658a",
                  width: "100px",
                  fontSize: "15px",
                }}
                onClick={() => status === BOARD_STATUS.LIST ? navigation('/register') : navigation('/list')}
              >
                {status === BOARD_STATUS.LIST ? "등 록" : "목 록"}
              </button>
            </div>
            <div id="tab1" className="tab-content active">
              {setComponent()}
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default BoardContainer;

const BOARD_STATUS = {
  LIST: "/list",
  REGISTER: "/register",
  DETAIL: "/detail",
} as const;
type BoardStatus = typeof BOARD_STATUS[keyof typeof BOARD_STATUS];