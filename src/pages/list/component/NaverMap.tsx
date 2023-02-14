import { FC, useEffect, useRef, useState } from "react";

// Hook
import useNaverMap from "hooks/useNaverMap";

interface INaverMap {
    curLocation: any;
  }
const NaverMap:FC<INaverMap> = ({curLocation}) => {

  // 네이버 지도
  const {naver} = useNaverMap()
  
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);
  //   const [curLocation, setCurLocation] = useState<naver.maps.LatLng | null>(
  //     null
  //   );

  const mapElement = useRef(null);
  useEffect(() => {
    if (mapElement.current && naver) {
      const location = new naver.maps.LatLng(37.5656, 126.9769);
      const mapOptions: naver.maps.MapOptions = {
        center: location,
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
      };

      const map = new naver.maps.Map(mapElement.current, mapOptions);
      setMap(map);
      const marker = new naver.maps.Marker({
        position: location,
        map,
      });
      setMarker(marker);
    }
  }, [naver]);

  // 지도 위치 변경
  useEffect(() => {
    if (map && marker && curLocation) {
      map.setCenter(curLocation);
      marker.setPosition(curLocation);
    }
  }, [curLocation, map, marker]);

  // 주소검색해서 위도, 경도 가져오기
  // const getSearchAddressCoordinate = (address:string) => {
  //   const getSearchAddressCoordinate = () => {
  //     naver.maps.Service.geocode(
  //       { query: "test" },
  //       (status: any, response: any) => {
  //         if (status === naver.maps.Service.Status.ERROR) {
  //           return alert("Something Wrong!");
  //         }
  //         if (response.v2.meta.totalCount === 0) {
  //           return alert("해당 장소가 등록되지 않았습니다.");
  //         }
  //         var htmlAddresses = [],
  //           item = response.v2.addresses[0],
  //           point = new naver.maps.Point(item.x, item.y);
  //         if (item.roadAddress) {
  //           htmlAddresses.push("[도로명 주소] " + item.roadAddress);
  //         }
  //         if (item.jibunAddress) {
  //           htmlAddresses.push("[지번 주소] " + item.jibunAddress);
  //         }
  //         if (item.englishAddress) {
  //           htmlAddresses.push("[영문명 주소] " + item.englishAddress);
  //         }

  //         // setCurLocation(new naver.maps.LatLng(item.y, item.x));
  //       }
  //     );
  //   };

  return (
    <div
      ref={mapElement}
      style={{ minHeight: "400px", marginTop: "10px" }}
    ></div>
  );
}
 
export default NaverMap;