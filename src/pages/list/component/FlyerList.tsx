import React, { FC, useEffect, useState } from "react";

// Component
import Pagination from "pages/common/pagination";
import FlyerTableList from "./FlyerTableList";
import Axios from "utils/Axios";
import { UserInfo, userInfo } from "state";
import { useRecoilValue } from "recoil";

const FlyerList: FC = () => {
  
  const user:UserInfo = useRecoilValue(userInfo)
  const [storeInfos, setStoreInfos] = useState<any[]>([]);

  useEffect(() => {

    if(!user.userId) return;

    const getStoreList = async () => {

      // 업체 목록 가져오기
      const storeList: any[] = await Axios.post(
        "https://lookthis.co.kr/store/getStoreList",
        JSON.stringify({ userId:user.userId }),'', user.jwt
      );
      // console.log("storeList", storeList);

      // [전단지 조회 파라미터, 업체 정보]
      const [getflyerAxios, storeInfos]: [any[], any[]] = storeList.reduce(
        (arr, curStore) => {
          arr[0].push(
            Axios.post(
              "https://lookthis.co.kr/store/getStoreFlyerList",
              JSON.stringify({ storeId: curStore.storeId }),'', user.jwt
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
      // console.log('storeInfos', storeInfos);

      // 전단지 정보 조회
      const flyerList = await Promise.all(getflyerAxios);
      // console.log("flyerList", flyerList);

      // 업체 정보에 전단지 정보 추가
      flyerList.forEach((flyer, index) => {
        if(flyer[0]) {
          storeInfos[index].path = flyer[0].path
          storeInfos[index].flyerId = flyer[0].flyerId
        };
      });
      // console.log("storeInfos", storeInfos);
      
      setStoreInfos(prev => storeInfos);
      setPageInfo(prev => ({...prev, dataCnt: storeInfos.length}));
    };

    getStoreList();
  }, [user]);

  const [pageInfo, setPageInfo] = useState({
    dataCnt: 0,
    currentPage: 1,
    row: 20,
  });

  return (
    <>
      <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <tbody>
          <FlyerTableList storeInfos={storeInfos} />
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
