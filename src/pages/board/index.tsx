import { FC, useState } from "react";

// Util
import Utils from "utils/Utils";

// component
import RegisterFlyer from "./component/RegisterFlyer";
import FlyerList from "./component/FlyerList";

const BoardContainer: FC = () => {
  const [status, setStatus] = useState<BoardStatus>(BOARD_STATUS.LIST);
  const setComponent = () => {
    if (status === BOARD_STATUS.LIST) return <FlyerList />;
    else if (status === BOARD_STATUS.REGISTER) return <RegisterFlyer />;
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
                onClick={() =>
                  setStatus((prev) =>
                    prev === BOARD_STATUS.LIST
                      ? BOARD_STATUS.REGISTER
                      : BOARD_STATUS.LIST
                  )
                }
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
  LIST: "list",
  REGISTER: "regithst",
  DETAIL: "detail",
} as const;
type BoardStatus = typeof BOARD_STATUS[keyof typeof BOARD_STATUS];