import Axios from "utils/Axios";

// Type
import { FlyerInfo } from "hooks/useFlyerInfo";
import { StoreInfo } from "hooks/useStoreInfo";
import { UserInfo } from "state";

// Flyer API
import { saveFlyerImg, deleteFlyerSpot, saveFlyerSpot } from "./flyer";

export const useGetStoreList = () => {};

// 업체 등록
const saveStore = async (storeInfo: StoreInfo, user: UserInfo) => {
  const saveStoreParams: any = {
    userId: "user.userId",
    storeId: storeInfo.storeId,
    address: storeInfo.address, // 업체 위치
    lat: storeInfo.storePositon.lat, // 업체 lat
    lng: storeInfo.storePositon.lng, // 업체 lng
    storeName: storeInfo.storeName, // 업체 이름
  };

  const res = await Axios.put(
    "https://lookthis.co.kr/store/saveStore",
    JSON.stringify(saveStoreParams),
    "",
    user.jwt
  );

  return res;
};

// 업체 및 광고 등록
export const registerStoreWithFlyer = async (
  storeInfo: StoreInfo,
  flyerInfo: FlyerInfo,
  user: UserInfo
) => {
  const { flyerId, spotIds, file } = flyerInfo;

  // Step 1. 업체 정보 저장
  const storeId = await saveStore(storeInfo, user);
  // file이 null이고, flyerId 있으면 기존 flyerId 사용

  // Step 2. 광고 이미지 저장 (경우에 따라 저장X)
  const isFlyerUpdate = !!!file && flyerId;
  const flyerIdRes = isFlyerUpdate ? flyerId : await saveFlyerImg(storeId, file, user);

  // Step 3. 광고 위치
  flyerId && (await deleteFlyerSpot(spotIds[0], Number(flyerId), user));
  await saveFlyerSpot(spotIds[0], flyerIdRes, user);

  alert("등록완료!");

  return storeId;
};
