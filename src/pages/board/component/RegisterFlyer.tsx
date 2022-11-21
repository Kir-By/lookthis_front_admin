import {
    ChangeEventHandler,
    FC,
    ReactNode,
    useEffect,
    useRef,
    useState,
  } from "react";
  
  import selectBoxImg from "static/media/i_arrow_b_downdrop.045cf5d….svg";
  
  // Hook
  import Axios from "utils/Axios";
  import useScript from "hooks/useScript";
  
  // Css
  import "assets/sass/notice_view.scss";
  
  // Type
  import Utils from "utils/Utils";
  import styled from "styled-components";
  import FilesUpload from "./FilesUpload";
  
  const SelectBox = styled.select`
    width: 140px;
    height: 46px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    background: #fff
      // url(http://localhost:3000/static/media/i_arrow_b_downdrop.045cf5d….svg) 93%
      center no-repeat;
    outline: none;
    appearance: none;
    cursor: pointer;
    text-indent: 10px;
  `;
  
  const Button = styled.button`
    width: 66px;
    height: 46px;
    font-size: 16px;
    border: 1px solid rgb(58, 58, 77);
    border-radius: 4px;
    background: rgb(255, 255, 255);
  `;
  
  const Input = styled.input`
    width: 260px;
    height: 46px;
    line-height: 46px;
    border-radius: 4px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 300;
    text-indent: 10px;
    color: #999;
  `;
  
  const Span = styled.span`
    margin: 0px;
    padding: 0px;
    font-family: "Spoqa Han Sans Neo", "sans-serif";
  `;
  
  const RegisterFlyer: FC = () => {
    // 네이버 지도
    // const [loading, error] = useScript("https://unpkg.com/lodash");
    const [loading, error] = useScript(
      "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=my4y6x6w9j&submodules=geocoder"
    );
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
        
      if(Object.values(storeInfo).filter(item => !item).length > 0) return alert('가게 정보를 입력하세요');
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
                placeholder="가게 이름을 입력하세요"
                title="가게 이름"
                setFn={handleStoreInfo}
              />
              <InfoInput
                inputName="address"
                inputValue={storeInfo.address}
                placeholder="가게 주소을 입력하세요"
                title="가게 주소"
                setFn={handleStoreInfo}
              >
                &nbsp;&nbsp;
                <Button
                  onClick={getSearchAddressCoordinate}
                >
                  검 색
                </Button>
              </InfoInput>
              <div style={{padding: '0px 20px 0px'}}><Map curLocation={storeInfo.storePositon} /></div>
              {/* <!-- 내용 --> */}
              <div className="content-wrap">
                <Span>광고 위치 선택</Span>&nbsp;&nbsp;
                {/* <span></span> */}
                <SelectBox
                  value={selectSpot}
                  onChange={(e) => movoSelectSpot(e.target.value)}
                >
                  <option value={""}>위치를 선택하세요</option>
                  {spotList.map((spot: any, index: number) => (
                    <option key={index} value={spot.lat + " " + spot.lng}>
                      {spot.station + " " + spot.stationExit + "번 출구"}
                    </option>
                  ))}
                  {/* <option>TEST</option> */}
                </SelectBox>
                &nbsp;&nbsp;
                <Input
                  placeholder="원하는 위치를 검색하세요"
                  value={searchCondition}
                  onChange={(e) => setSearchCondition((prev) => e.target.value)}
                />
                &nbsp;&nbsp;
                <Button onClick={searchSpot}>검 색</Button>
                {/* <div
                  ref={mapElement}
                  style={{ minHeight: "400px", marginTop: "10px" }}
                /> */}
                <Map curLocation={curLocation} />
              </div>
              <div className="file-wrap">
                이미지 등록
                <FilesUpload />
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
  
  export default RegisterFlyer;
  
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
        {/* <p className="icon-state">가게 이름</p> */}
        <p className="title">
          <Input
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
  