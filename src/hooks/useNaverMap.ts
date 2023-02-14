import { useCallback } from "react";

// Hook
import useComponentState from "./useComponentState";
import useScript from "./useScript";

const useNaverMap = () => {
  const { naver } = window;

  // 지도 있으면 스크립트 호출하지 않음
  const src = naver
    ? ""
    : "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=my4y6x6w9j&submodules=geocoder";

  useScript(src);

  // 지도 center 위치
  const { state: curMapLocation, handleState: handleCurMapLocation } =
    useComponentState<naver.maps.LatLng | null>(null);

  // 주소검색해서 위도, 경도 가져오기
  const getSearchAddressCoordinate = useCallback(
    (
      address: string,
      callbackFn: (prameter: { lat: number; lng: number }) => void
    ) => {
      naver.maps.Service.geocode(
        { query: address },
        (status: any, response: any) => {
          if (status === naver.maps.Service.Status.ERROR) {
            return alert("Something Wrong!");
          }
          if (response.v2.meta.totalCount === 0) {
            return alert("해당 장소가 등록되지 않았습니다.");
          }

          const htmlAddresses = [],
            item = response.v2.addresses[0],
            point = new naver.maps.Point(item.x, item.y);

          if (item.roadAddress) {
            htmlAddresses.push("[도로명 주소] " + item.roadAddress);
          }
          if (item.jibunAddress) {
            htmlAddresses.push("[지번 주소] " + item.jibunAddress);
          }
          if (item.englishAddress) {
            htmlAddresses.push("[영문명 주소] " + item.englishAddress);
          }

          const coordinate = new naver.maps.LatLng(item.y, item.x);
          callbackFn({ lat: coordinate._lat, lng: coordinate._lng });
        }
      );
    },
    [naver]
  );

  return {
    naver,
    curMapLocation,
    handleCurMapLocation,
    getSearchAddressCoordinate,
  };
};

export default useNaverMap;
