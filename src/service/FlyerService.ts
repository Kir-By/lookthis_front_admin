import { UserInfo } from "state";
import Axios from "utils/Axios";

const getDetail = async (user:UserInfo, storeId:string, flyerId:string) => {
    const storeList: any[] = await Axios.post(
      "https://lookthis.co.kr/store/getStoreList",
      JSON.stringify({ userId: user.userId }),'',user.jwt
    );

    const store = storeList.filter(
      (store) => store.storeId === Number(storeId)
    )[0];
    // console.log("store", store);

    const flyerRes = await Axios.post(
      "https://lookthis.co.kr/store/getStoreFlyerList",
      JSON.stringify({ storeId }),'',user.jwt
    );
    // console.log("flyer", flyerRes);

    const spotRes = await Axios.post(
      "https://lookthis.co.kr/store/getFlyerSpotList",
      JSON.stringify({ flyerId }), '', user.jwt
    );
    // console.log("spot", spotRes);
    
    return [store, flyerRes[0], spotRes[0]]
  };

export {getDetail};