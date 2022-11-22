import { FC, ReactNode, useEffect, useRef, useState } from "react";

// Hook
import Axios from "utils/Axios";
import useScript from "hooks/useScript";

// Css
import "assets/sass/notice_view.scss";

// Type
import { useParams } from "react-router-dom";

const FlyerDetail: FC = () => {
  const { id } = useParams();
  const [store, setStore] = useState<any>({});
  useEffect(() => {
    const getStore = async () => {
      const storeList: any[] = await Axios.post(
        "https://lookthis-back.nhncloud.paas-ta.com/getStoreList",
        JSON.stringify({ userId: "nsw3" })
      );

      const store = storeList.filter(
        (store) => store.storeId === Number(id)
      )[0];
      console.log("store", store);

      const flyer = await Axios.post(
        "https://lookthis-back.nhncloud.paas-ta.com/getStoreFlyerList",
        JSON.stringify({ storeId: store.storeId })
      );
      console.log("flyer", flyer);

      // console.log("getflyerAxios", getflyerAxios);
      //   console.log('storeFlyers', storeFlyers);

      // const flyerList = await Promise.all(getflyerAxios);
      // console.log("flyerList", flyerList);
      // flyerList.reduce((arr, cur, index) => {
      //   arr[index].path =
      //     cur?.path ||
      //     "https://image.utoimage.com/preview/cp864374/2022/09/202209000321_206.jpg";
      //   return arr;
      // }, storeFlyers);

      setStore((prev: any) => ({ ...prev, ...store, ...flyer }));
    };

    getStore();
  }, []);

  // 네이버 지도
  // const [loading, error] = useScript("https://unpkg.com/lodash");
  const [loading, error] = useScript(
    "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=my4y6x6w9j&submodules=geocoder"
  );
  const { naver } = window;

  const [curLocation, setCurLocation] = useState<naver.maps.LatLng | null>(
    null
  );

  // 주소검색해서 위도, 경도 가져오기
  const getSearchAddressCoordinate = () => {
    naver.maps.Service.geocode(
      { query: storeInfo.address },
      (status: any, response: any) => {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something Wrong!");
        }
        if (response.v2.meta.totalCount === 0) {
          return alert("해당 장소가 등록되지 않았습니다.");
        }
        var htmlAddresses = [],
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
        setStoreInfo((prev) => ({
          ...prev,
          storePositon: new naver.maps.LatLng(item.y, item.x),
        }));
      }
    );
  };

  // 가게 정보
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    address: "",
    storePositon: null as any,
  });

  // 가게 정보 입력
  const handleStoreInfo = (key: string, value: string) => {
    setStoreInfo((prev) => ({ ...prev, [key]: value }));
  };

  // 광고 등록장소 정보
  const [spotList, setSpotList] = useState<any[]>([]);
  // 로딩 시 광고 등록장소 리스트 가져오기
  useEffect(() => {
    const getSpotList = async () => {
      const spotResult = (await Axios.post(
        "https://lookthis-back.nhncloud.paas-ta.com/getSpotList",
        {}
      )) as any[];
      setSpotList((prev) => spotResult);
    };

    getSpotList();
  }, []);

  // 광고 등록장소 필터값 입력
  const [searchCondition, setSearchCondition] = useState("");
  // 광고 등록장소 검색
  const searchSpot = () => {
    const reg = new RegExp(`(${searchCondition})`, "g");
    const filterSpot = spotList.filter(
      (item: any) => !searchCondition || item.station.match(reg)
    );
    setSpotList((prev) => filterSpot);
    movoSelectSpot(filterSpot[0].lat + " " + filterSpot[0].lng);
  };

  // 선택한 광고 등록장소
  const [selectSpot, setSelectSpot] = useState("");
  // 선택한 광고 등록장소로 지도 이동
  const movoSelectSpot = (latLng: string) => {
    if (!latLng) return;
    const [lat, lng] = latLng.split(" ");
    setSelectSpot(lat + " " + lng);
    setCurLocation(new naver.maps.LatLng(Number(lat), Number(lng)));
  };

  // 가게 정보 등록
  const registerStore = async () => {
    if (Object.values(storeInfo).filter((item) => !item).length > 0)
      return alert("가게 정보를 입력하세요");
    const [lat, lng] = selectSpot.split(" ");
    const params = {
      userId: "nsw3",
      address: storeInfo.address,
      authStatus: 1,
      authUser: "관리자",
      lat: Number(lat),
      lng: Number(lng),
      storeName: storeInfo.storeName,
    };
    const res = await Axios.put(
      "https://lookthis-back.nhncloud.paas-ta.com/saveStore",
      JSON.stringify(params)
    );
    console.log(res);
    alert("등록완료!");
  };

  return (
    <>
      {naver && store && (
        <div className="view-wrap">
          <InfoInput
            inputName="storeName"
            inputValue={store.storeName}
            title="가게 이름"
          />
          <InfoInput
            inputName="address"
            inputValue={store.address}
            title="가게 주소"
          />
          <div style={{ padding: "0px 20px 0px" }}>
            <Map
              curLocation={
                new naver.maps.LatLng(Number(store.lat), Number(store.lng))
              }
            />
          </div>
          {/* <!-- 내용 --> */}
          <div className="content-wrap">
          <InfoInput
            inputName="spot"
            inputValue={''}
            title="광고 등록 주소"
          />
            <Map curLocation={curLocation} />
          </div>
          <div className="file-wrap">
            이미지 등록
            {/* <FilesUpload /> */}
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
