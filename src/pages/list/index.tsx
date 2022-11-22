import { FC, useEffect, useState } from "react";

// component
import { useNavigate, useParams } from "react-router-dom";
import loadable from '@loadable/component';
const FlyerList = loadable(() => import('pages/list/component/FlyerList'));
const FlyerDetail = loadable(() => import('pages/list/component/FlyerDetail'));
const RegisterFlyer = loadable(() => import('pages/list/component/RegisterFlyer'));

const FlyerListContainer: FC = () => {

  const { id } = useParams();
  const BOARD_STATUS_INFO = {
    [BOARD_STATUS.LIST]: [{onClickFn:() => navigation('/register'), btnTitle:'등 록', className: "list_register_btn"}],
    [BOARD_STATUS.REGISTER]: [{onClickFn:() => navigation('/list'), btnTitle:'목 록', className: "list_list_btn"}],
    [BOARD_STATUS.DETAIL]: [{onClickFn:() => navigation('/list'), btnTitle:'목 록', className: "list_list_btn" }, {onClickFn:() => navigation(`/update/${id}`), btnTitle:'수 정', className: "list_update_btn" }],
    [BOARD_STATUS.UPDATE]: [{onClickFn:() => navigation(`/detail/${id}`), btnTitle:'취 소', className: "list_register_btn" }, {onClickFn:() => navigation(`/update/${id}`), btnTitle:'삭 제', className: "list_delete_btn" }],
  } as const;
  type BoardStatus = typeof BOARD_STATUS[keyof typeof BOARD_STATUS];
  
  const navigation = useNavigate();
  const [status, setStatus] = useState<BoardStatus>(BOARD_STATUS.LIST);
  const pathName = window.location.pathname.split('/')[1];
  useEffect(() => {
    setStatus(prev => pathName as BoardStatus);
  },[pathName]);

  const setComponent = () => {
    if (status === BOARD_STATUS.LIST) return <FlyerList />;
    else if (status === BOARD_STATUS.REGISTER) return <RegisterFlyer />;
    else if (status.includes(BOARD_STATUS.DETAIL)) return <FlyerDetail />;
    else if (status.includes(BOARD_STATUS.UPDATE)) return <FlyerDetail />;
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
              {
                Object.values(BOARD_STATUS_INFO[status]).map(item => (
                  <><button className={item.className} onClick={item.onClickFn}>{item.btnTitle}</button>&nbsp;&nbsp;</>
                ))
              }
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

export default FlyerListContainer;

const BOARD_STATUS = {
  LIST: 'list',
  REGISTER: 'register', 
  DETAIL: 'detail',
  UPDATE: 'update',
} as const;