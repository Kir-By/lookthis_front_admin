import { FC, ReactNode, useEffect, useRef, useState } from "react";

// Hook
import Axios from "utils/Axios";
import useScript from "hooks/useScript";

// Css
import "assets/sass/notice_view.scss";

// Type
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserInfo, userInfo } from "state";
import { getDetail } from "service/FlyerService";

const FlyerDetail: FC = () => {

  const { storeId, flyerId } = useParams();
  const [detailInfo, setDetailInfo] = useState<any>({});

  const user:UserInfo = useRecoilValue(userInfo);

  
  // 네이버 지도
  // const [loading, error] = useScript("https://unpkg.com/lodash");
  const [loading, error] = useScript(
    "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=my4y6x6w9j&submodules=geocoder"
  );
  const { naver } = window;
  
  useEffect(() => {
    const getDetailInfo = async () => {
      const [store, flyer, spot] = await getDetail(user, storeId as string, flyerId  as string);
      const {address, lat, lng, storeName} = store;
      setStoreInfo((prev: any) => ({ ...prev, storeName, address, storePositon: new naver.maps.LatLng(Number(lat), Number(lng)) }));
      setDetailInfo((prev: any) => ({ ...prev, ...store, ...flyer, spotId:spot.spotId, spotLat:spot.lat, spotLng:spot.lng }));
      setSelectSpot((prev: any) => spot.station + ' ' + spot.stationExit + '번 출구');
      movoSelectSpot(spot.lat + ' ' + spot.lng);
    };

    naver && getDetailInfo();

  }, [naver]);
  // console.log('detailInfo', detailInfo);

  // 광고 위치
  const [curLocation, setCurLocation] = useState<naver.maps.LatLng | null>(
    null
  );

  // 업체 정보
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    address: "",
    storePositon: null as any,
  });

  // 선택한 광고 등록장소 이름
  const [selectSpot, setSelectSpot] = useState("");
  // 선택한 광고 등록장소로 지도 이동
  const movoSelectSpot = (latLng: string) => {
    if (!latLng) return;
    const [lat, lng] = latLng.split(" ");
    setCurLocation(new naver.maps.LatLng(Number(lat), Number(lng)));
  };

  return (
    <>
      {naver && detailInfo && (
        <div className="view-wrap">
          {/* <!-- 업체 등록 정보 --> */}
          <InfoInput
            inputName="storeName"
            inputValue={storeInfo.storeName}
            title="업체 이름"
          />
          <div style={{marginTop: '30px'}}>
          <InfoInput
            inputName="address"
            inputValue={storeInfo.address}
            title="업체 주소"
          />
          </div>
          <div style={{ padding: "0px 20px 0px" }}>
            <Map
              curLocation={storeInfo.storePositon}
            />
          </div>
          {/* <!-- 광고 등록 주소 --> */}
          <div className="content-wrap" >
          <InfoInput
            inputName="spot"
            inputValue={selectSpot}
            title="광고 등록 주소"
          />
            <Map curLocation={curLocation} />
          </div>
          <div className="file-wrap">
            광고 이미지
            <div style={{ padding: "20px", maxWidth: "18%", minWidth: "18%" }} >
              {detailInfo.path && <img src={`https://lookthis.s3.ap-northeast-2.amazonaws.com/flyer/image${detailInfo.path}`} alt="" style={{width:'100%'}} />}
           </div>
          </div>
          {/* <Content contentsUrl={contents} /> */}
          {/* <!-- 파일첨부 --> */}
          {/* {<FileList boardId={boardId} />} */}
        </div>
      )}
    </>
  );
};

export default FlyerDetail;

interface MapProps {
  curLocation: any;
}
// 네이버 지도
const Map: FC<MapProps> = ({ curLocation }) => {
  const { naver } = window;
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
};

const InfoInput: FC<{
  title: string;
  inputName: string;
  inputValue: any;
  children?: ReactNode;
}> = ({ title, inputName, inputValue, children }) => {
  return (
    <div className="title-wrap">
      <p className="sort-state">{title}</p>
      <p className="title">
        <input
          className="storeInfo"
          name={inputName}
          defaultValue={inputValue}
          disabled
        />
      </p>
      {children}
    </div>
  );
};
