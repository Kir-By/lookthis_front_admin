import { UserInfo } from "state";
import Axios from "utils/Axios";

const getDetail = async (user:UserInfo, storeId:string, flyerId:string) => {
    const storeList: any[] = await Axios.get(
      "https://lookthis.co.kr/api/store/user/"+user.userId,
      '','',user.jwt
    );

    const store = storeList.filter(
      (store) => store.storeId === Number(storeId)
    )[0];
    // console.log("store", store);

    const flyerRes = await Axios.get(
      "https://lookthis.co.kr/api/store/"+storeId+"/flyers",
      '','',user.jwt
    );
    // console.log("flyer", flyerRes);

    const spotRes = await Axios.get(
      "https://lookthis.co.kr/api/flyer/"+flyerId+"/spots",
      '', '', user.jwt
    );
    // console.log("spot", spotRes);
    
    return [store, flyerRes[0], spotRes[0]]
  };

export {getDetail};