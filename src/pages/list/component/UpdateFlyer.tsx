import {
    ChangeEventHandler,
    FC,
    ReactNode,
    useEffect,
    useRef,
    useState,
  } from "react";
  
  // Hook
  import useScript from "hooks/useScript";
  
  // Css
  import "assets/sass/notice_view.scss";
  
  // Util
  import Axios from "utils/Axios";
  import Utils from "utils/Utils";

  // Component
  import FilesUpload from "./FilesUpload";
import { userInfo } from "state";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
  
  const UpdateFlyer: FC = () => {

    // 유저 Id
    const userId = useRecoilValue(userInfo);
    // 네이버 지도
    // const [loading, error] = useScript("https://unpkg.com/lodash");
    const [loading, error] = useScript(
      "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=my4y6x6w9j&submodules=geocoder"
    );
    // 지도 center 위치
    const [curLocation, setCurLocation] = useState<naver.maps.LatLng | null>(
      null
    );
    // 업체 정보
    const [storeInfo, setStoreInfo] = useState({
        storeName: "",
        address: "",
        storePositon: null as any,
      });
    // 광고 등록 가능한 장소 리스트
    const [spotList, setSpotList] = useState<any[]>([]);
    // 광고 등록장소 필터값 입력
    const [searchCondition, setSearchCondition] = useState("");
    // 광고 등록할 장소 Id
    const [spotId, setSpotId] = useState(0);
    // 첨부파일(광고 이미지) 정보
    const [file, setFile] = useState<any>(null);

    // 로딩 시 광고 등록장소 리스트 가져오기
    useEffect(() => {
        const getSpotList = async () => {
          const spotResult = (await Axios.get(
            "https://lookthis.co.kr/api/spots",
            '','', userId.jwt
          )) as any[];
          setSpotList((prev) => spotResult);
        };
    
        getSpotList();
      }, []);

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
 
    // 업체 정보 입력
    const handleStoreInfo = (key: string, value: string) => {
      setStoreInfo((prev) => ({ ...prev, [key]: value }));
    };
    console.log(spotList);

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
    console.log('selectSpot', selectSpot);
    // 선택한 광고 등록장소로 지도 이동
    const movoSelectSpot = (latLng: string) => {
      if (!latLng) return;
      const [lat, lng, spotId] = latLng.split(" ");
      setSpotId(Number(spotId));
      setSelectSpot(lat + " " + lng);
      setCurLocation(new naver.maps.LatLng(Number(lat), Number(lng)));
    };
  
    // 업체 광고 등록
    const navigation = useNavigate();
    const registerStore = async () => {
        
      console.log('storeInfo', storeInfo);
      if(Object.values(storeInfo).filter(item => !item).length > 0) return alert('업체 정보를 입력하세요');
      
      try {
        const storeId = await saveStore();
        const flyerId = await saveFlyer(storeId);
        await saveFlyerSpot(flyerId);
        alert("등록완료!");  
        navigation(`/detail/${storeId}`);
      }
      catch (error) {
        console.log(error);
        alert("에러발생!!!")
      };
      
    };

    // 업체 등록
    const saveStore = async () => {

      const saveStoreParams = {
        userId,
        address: storeInfo.address, // 업체 위치
        lat: Number(storeInfo.storePositon.y), // 업체 lat
        lng: Number(storeInfo.storePositon.x), // 업체 lng
        storeName: storeInfo.storeName, // 업체 이름
      };

      const res = await Axios.put(
        "https://lookthis.co.kr/api/store",
        JSON.stringify(saveStoreParams),'', userId.jwt
      );

      return res;
    };

    // 광고 이미지 등록
    const saveFlyer = async (storeId:number) => {
        const formData = new FormData();
        formData.append('storeId', storeId.toString());
        formData.append('flyerFile', file[0]);
        console.log('formData', formData);
        const res = await Axios.put('https://lookthis.co.kr/api/flyer', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json; charset=UTF-8',
          },
      });
        console.log('flyerId', res);
        return res;
    };

    // 광고 보여줄 장소 등록
    const saveFlyerSpot = async (flyerId: number) => {
      console.log(spotId);
      await Axios.put(
        "https://lookthis.co.kr/api/flyer/spot",
        JSON.stringify({ spotId, flyerId })
      );
    };
  
    return (
      <>
            <div className="view-wrap">
              {/* <!-- 카테고리, 날짜 --> */}
              <div className="record-wrap">
                <p className="sort-state">등록일자</p>
                <p className="date">{Utils.converDateFormat(new Date(), "-")}</p>
              </div>
              {/* <!-- 상태, 제목 --> */}
              <InfoInput
                inputName="storeName"
                inputValue={storeInfo.storeName}
                placeholder="업체 이름을 입력하세요"
                title="업체 이름"
                setFn={handleStoreInfo}
              />
              <InfoInput
                inputName="address"
                inputValue={storeInfo.address}
                placeholder="업체 주소을 입력하세요"
                title="업체 주소"
                setFn={handleStoreInfo}
              >
                &nbsp;&nbsp;
                <button className="registerBtn"
                  onClick={getSearchAddressCoordinate}
                >
                  검 색
                </button>
              </InfoInput>
              <div style={{padding: '0px 20px 0px'}}><Map curLocation={storeInfo.storePositon} /></div>
              {/* <!-- 내용 --> */}
              <div className="content-wrap">
                <span className="registerSpan">광고 위치 선택</span>&nbsp;&nbsp;
                {/* <span></span> */}
                <select
                className="registerSelect"
                  value={selectSpot}
                  onChange={(e) => movoSelectSpot(e.target.value)}
                >
                  <option value={""}>위치를 선택하세요</option>
                  {spotList.map((spot: any, index: number) => (
                    <option key={index} value={spot.lat + " " + spot.lng + " " + spot.spotId}>
                      {spot.station + " " + spot.stationExit + "번 출구"}
                    </option>
                  ))}
                  {/* <option>TEST</option> */}
                </select>
                &nbsp;&nbsp;
                <input
                  className="storeInfo"
                  placeholder="원하는 위치를 검색하세요"
                  value={searchCondition}
                  onChange={(e) => setSearchCondition((prev) => e.target.value)}
                />
                &nbsp;&nbsp;
                <button className="registerBtn" onClick={searchSpot}>검 색</button>
                {/* <div
                  ref={mapElement}
                  style={{ minHeight: "400px", marginTop: "10px" }}
                /> */}
                <Map curLocation={curLocation} />
              </div>
              <div className="file-wrap">
                이미지 등록
                {/* <FilesUpload file={file} setFile={setFile} /> */}
              </div>
              {/* <Content contentsUrl={contents} /> */}
              {/* <!-- 파일첨부 --> */}
              {/* {<FileList boardId={boardId} />} */}
            </div>
            <div className="btn-wrap">
              <button className="btn-list-more" onClick={registerStore} style={{background: 'rgb(241,101,138)'}}>
                등 록
              </button>
            </div>
          </>
    );
  };
  
  export default UpdateFlyer;
  
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
    placeholder: string;
    inputName: string;
    inputValue: any;
    setFn: (key: string, value: string) => void;
    children?: ReactNode;
  }> = ({ title, placeholder, inputName, inputValue, setFn, children }) => {
    const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
      const key = e.target.name;
      const value = e.target.value;
      setFn(key, value);
    };
    return (
      <div className="title-wrap">
        <p className="sort-state">{title}</p>
        <p className="title">
          <input
            className="storeInfo"
            placeholder={placeholder}
            name={inputName}
            value={inputValue}
            onChange={handleInput}
          />
        </p>
        {children}
      </div>
    );
  };
  