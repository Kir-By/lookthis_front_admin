import React, { FC, useEffect, useState } from "react";

// Component
import Pagination from "pages/common/pagination";
import Flyer from "./Flyer";
import Axios from "utils/Axios";
import { userInfo } from "state";
import { useRecoilValue } from "recoil";

const FlyerList: FC = () => {
  
  const userId = useRecoilValue(userInfo);
  console.log(userId);
  const [storeFlyers, setStoreFlyers] = useState<any[]>([]);

  useEffect(() => {

    if(!userId) return;

    const getStoreList = async () => {
      const storeList: any[] = await Axios.post(
        "https://lookthis-back.nhncloud.paas-ta.com/getStoreList",
        JSON.stringify({ userId })
      );
      console.log("storeList", storeList);

      const [getflyerAxios, storeFlyers]: [any[], any[]] = storeList.reduce(
        (arr, curStore) => {
          arr[0].push(
            Axios.post(
              "https://lookthis-back.nhncloud.paas-ta.com/getStoreFlyerList",
              JSON.stringify({ storeId: curStore.storeId })
            )
          );
          arr[1].push({
            storeId: curStore.storeId,
            storeName: curStore.storeName,
            address: curStore.address,
            lat: curStore.lat,
            lng: curStore.lng,
          });
          return arr;
        },
        [[], []]
      );

      // console.log("getflyerAxios", getflyerAxios);
      //   console.log('storeFlyers', storeFlyers);

      const flyerList = await Promise.all(getflyerAxios);
      console.log("flyerList", flyerList);
      flyerList.reduce((arr, cur, index) => {
        console.log('cur.path', cur[0].path, cur);
        arr[index].path =
          cur[0].path ||
          "https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg";
        return arr;
      }, storeFlyers);

      console.log("storeFlyers", storeFlyers);
      setStoreFlyers(prev => storeFlyers);
      setPageInfo(prev => ({...prev, dataCnt: storeFlyers.length}));
    };

    getStoreList();
  }, [userId]);

  const [pageInfo, setPageInfo] = useState({
    dataCnt: 0,
    currentPage: 1,
    row: 20,
  });

  return (
    <>
      <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        {/* Column Width */}
        {/* <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup> */}
        <tbody>
          <Flyer flyerList={storeFlyers} />
        </tbody>
      </table>
      <TableBottom pageInfo={pageInfo} setPageInfo={setPageInfo} />
    </>
  );
};

export default FlyerList;

interface TableBottomProps {
  pageInfo: {
    dataCnt: number;
    currentPage: number;
    row: number;
  };
  setPageInfo: React.Dispatch<
    React.SetStateAction<{
      dataCnt: number;
      currentPage: number;
      row: number;
    }>
  >;
}
const TableBottom: FC<TableBottomProps> = ({ pageInfo, setPageInfo }) => {
  const { dataCnt = 1, currentPage = 1, row = 50 } = pageInfo;
  const handlePageChange = (changePage: number) => {
    setPageInfo((prev) => ({ ...prev, currentPage: changePage }));
  };

  const handlePageRow = (row: number) => {
    setPageInfo((prev) => ({ ...prev, row, currentPage: 1 }));
  };

  return (
    <>
      {!!dataCnt && (
        <div className="result-function-wrap">
          <Pagination
            dataCnt={dataCnt}
            handlePageChange={handlePageChange}
            handlePageRow={handlePageRow}
            pageInfo={{ currentPage, row }}
          />
        </div>
      )}
    </>
  );
};
