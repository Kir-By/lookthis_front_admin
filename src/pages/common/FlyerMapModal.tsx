import Modal from "pages/common/Modal";
import { FC, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

// State
import { UserInfo, userInfo } from "state";

// Hook
import { FlyerInfo } from "hooks/useFlyerInfo";

// API
import { getSpotList } from "api/flyer";

// Component
import NaverMap from "../list/component/NaverMap";
import useNaverMap from "hooks/useNaverMap";
import useComponentState from "hooks/useComponentState";

interface IFlyerMapModal {
  flyerInfo: FlyerInfo;
  handleFlyerInfo: (state: Partial<FlyerInfo>) => void;
  handleFlyerModal: (isOpen: boolean) => void;
}
const FlyerMapModal: FC<IFlyerMapModal> = ({
  flyerInfo,
  handleFlyerInfo,
  handleFlyerModal,
}) => {
  // 유저 Id
  const user: UserInfo = useRecoilValue(userInfo);
  const { spotIds, spotNames, searchSpotCondition } = flyerInfo;

  // Naver Map
  const { naver, curMapLocation, handleCurMapLocation } = useNaverMap();

  // 광고 등록 가능한 장소 리스트
  const [spotList, setSpotList] = useState<any[]>([]);
  // 로딩 시 광고 등록장소 리스트 가져오기
  useEffect(() => {
    getSpotList(user).then((res) => setSpotList(res));
  }, [user, setSpotList]);

  // 선택한 광고 등록장소
  const { state: selectedSpot, handleState: handleSelectSpot } =
    useComponentState("");

  // 선택한 광고 등록장소로 지도 이동
  const movoToSelectedSpot = (spotJsonStr: string) => {
    if (!spotJsonStr) return;
    handleSelectSpot(spotJsonStr);

    const spot = JSON.parse(spotJsonStr);
    const { lat, lng, spotId, index } = spot;

    let newSpotIds = [...spotIds];
    newSpotIds[index] = Number(spotId);
    let newSpotNames = [...spotNames];
    newSpotNames[index] = spot.station + " " + spot.stationExit + "번 출구";

    handleFlyerInfo({ spotIds: newSpotIds, spotNames: newSpotNames });

    handleCurMapLocation(new naver.maps.LatLng(Number(lat), Number(lng)));
  };

  // 광고 등록장소 검색
  const searchSpot = () => {
    const reg = new RegExp(`(${searchSpotCondition})`, "g");
    const filterSpot = spotList.filter(
      (item: any) => !searchSpotCondition || item.station.match(reg)
    );
    setSpotList((prev) => filterSpot);
    movoToSelectedSpot(JSON.stringify(filterSpot[0]));
  };

  return (
    <Modal
      handleIsPop={() => handleFlyerModal(false)}
      content={
        <div className="content-wrap">
          <div>
            <span className="registerSpan">광고 위치 선택</span>&nbsp;&nbsp;
            {/* <span></span> */}
            <select
              className="registerSelect"
              value={selectedSpot}
              onChange={(e) => movoToSelectedSpot(e.target.value)}
            >
              <option value={""}>위치를 선택하세요</option>
              {spotList.map((spot: any, index: number) => (
                <option key={index} value={JSON.stringify({ ...spot, index })}>
                  {spot.station + " " + spot.stationExit + "번 출구"}
                </option>
              ))}
            </select>
            &nbsp;&nbsp;
            <input
              className="storeInfo"
              placeholder="지하철역을 검색하세요"
              value={searchSpotCondition}
              // onChange={(e) => setSearchCondition((prev) => e.target.value)}
            />
            <button className="registerBtn" onClick={searchSpot}>
              검 색
            </button>
            {spotNames.map((spotName) => (
              <span>{` ${spotName}`}</span>
            ))}
          </div>
          <NaverMap curLocation={curMapLocation} />
        </div>
      }
    />
  );
};

export default FlyerMapModal;
