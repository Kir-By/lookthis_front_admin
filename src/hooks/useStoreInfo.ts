// Hook
import useComponentState from "./useComponentState";

const useStoreInfo = () => {
  const { state:storeInfo, handleStateByObject:handleStoreInfo } = useComponentState<StoreInfo>({
    storeId: "",
    storeName: "",
    address: "",
    storePositon: {
      lat: 37.5656, 
      lng: 126.9769,
    },
  });

  return {storeInfo, handleStoreInfo};
};

export default useStoreInfo;

export type StoreInfo = {
  storeId: string;
  storeName: string;
  address: string;
  storePositon: {
    lat: number,
    lng: number,
  };
};
