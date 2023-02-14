import { UserInfo } from "state";
import Axios from "utils/Axios";

export const useGetFlyerList = () => {};

// 광고 이미지 등록
export const saveFlyerImg = async (storeId: number, file: any, user: UserInfo) => {
  const formData = new FormData();
  formData.append("storeId", storeId.toString());
  formData.append("flyerFile", file[0]);
  const res = await Axios.put(
    "https://lookthis.co.kr/store/saveFlyer",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json; charset=UTF-8",
        Authorization: "Bearer " + user.jwt,
      },
    }
  );
  return res;
};

// 광고 보여줄 장소 등록
export const saveFlyerSpot = async (spotId: number, flyerId: number, user: UserInfo) => {
  await Axios.put(
    "https://lookthis.co.kr/store/insertFlyerSpot",
    JSON.stringify({ spotId, flyerId }),
    "",
    user.jwt
  );
};

// 광고 보여줄 장소 삭제
export const deleteFlyerSpot = async (spotId: number, flyerId: number, user: UserInfo) => {
  await Axios.post(
    "https://lookthis.co.kr/store/deleteFlyerSpot",
    JSON.stringify({ spotId, flyerId }),
    "",
    user.jwt
  );
};

// 지하철역 장소 리스트 가져오기
export const getSpotList = async (user: UserInfo) => {
  return (await Axios.post(
    "https://lookthis.co.kr/spot/getSpotList",
    {},
    "",
    user.jwt
  )) as any[];
};