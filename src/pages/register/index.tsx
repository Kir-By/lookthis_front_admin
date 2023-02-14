import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Hook
import useStoreInfo from "hooks/useStoreInfo";
import useNaverMap from "hooks/useNaverMap";
import useOpenModal from "hooks/useOpenModal";
import useFlyerInfo from "hooks/useFlyerInfo";

// Css
import "assets/sass/notice_view.scss";

// Util
import Utils from "utils/Utils";

// State
import { useRecoilValue } from "recoil";
import { UserInfo, userInfo } from "state";

// API
import { registerStoreWithFlyer } from "api/store";

// Component
import FilesUpload from "../list/component/FilesUpload";
import FlyerMapModal from "../common/FlyerMapModal";
import NaverMap from "../list/component/NaverMap";
import InfoInput from "pages/common/InfoInput";

const Register: FC = () => {
  const { storeId, flyerId } = useParams();
  // 유저 정보
  const user: UserInfo = useRecoilValue(userInfo);

  // 업체 정보
  const { storeInfo, handleStoreInfo } = useStoreInfo();
  // 광고 정보
  const { flyerInfo, handleFlyerInfo } = useFlyerInfo();
  // 광고 위치 모달 제어
  const { isOpenModal: openFlyerModal, handleIsOpenModal: handleFlyerModal } =
    useOpenModal();

  // 네이버 지도
  const { getSearchAddressCoordinate } = useNaverMap();
  // 주소검색해서 위도, 경도 가져오기
  const handleStoreSpot = useCallback(() => {
    getSearchAddressCoordinate(storeInfo.address, (latLngObj) =>
      handleStoreInfo({ storePositon: latLngObj })
    );
  }, [getSearchAddressCoordinate, handleStoreInfo, storeInfo.address]);

  // 업체 및 광고 등록
  const navigate = useNavigate();
  const handleRegister = useCallback(() => {
    // Validation
    if (Object.values(storeInfo).filter((item) => !item).length > 0)
      return alert("업체 정보를 입력하세요");
    if (!storeInfo.storeId && !!!flyerInfo.file)
      return alert("이미지를 등록하세요");

    try {
      registerStoreWithFlyer(storeInfo, flyerInfo, user);
      navigate(`/detail/${storeInfo.storeId}`);
    } catch (error) {
      // console.log(error);
      alert("에러발생!!!");
    }
  }, [navigate, storeInfo, flyerInfo, user]);

  return (
    <>
      <div className="view-wrap">
        {/* <!-- 카테고리, 날짜 --> */}
        <div className="record-wrap">
          <p className="sort-state">등록일자</p>
          <p className="date">{Utils.converDateFormat(new Date(), "-")}</p>
        </div>
        {/* <!-- 상태, 제목 --> */}
        <div style={{ marginTop: "30px" }}>
          <InfoInput
            inputName="storeName"
            inputValue={storeInfo.storeName}
            placeholder="업체 이름을 입력하세요"
            title="업체 이름"
            setFn={handleStoreInfo}
          />
        </div>
        <div style={{ marginTop: "30px" }}>
          <InfoInput
            inputName="address"
            inputValue={storeInfo.address}
            placeholder="업체 주소을 입력하세요"
            title="업체 주소"
            setFn={handleStoreInfo}
          >
            &nbsp;&nbsp;
            <button className="registerBtn" onClick={handleStoreSpot}>
              검 색
            </button>
          </InfoInput>
        </div>
        <div style={{ padding: "0px 20px 0px" }}>
          <NaverMap curLocation={storeInfo.storePositon} />
        </div>
        {/* <!-- 내용 --> */}
        <div className="content-wrap">
          <span className="registerSpan">광고 위치</span>&nbsp;&nbsp;
          <button
            className="registerBtn"
            style={{ height: "35px" }}
            onClick={() => handleFlyerModal(true)}
          >
            선 택
          </button>
          {flyerInfo.spotNames.map((spotName) => (
            <span>{` ${spotName}`}</span>
          ))}
        </div>
        <div className="file-wrap">
          광고 이미지 등록{" "}
          {storeId && flyerId && (
            <span style={{ color: "blue" }}>
              (이미지를 등록하지 않으면 기존 이미지를 사용합니다.)
            </span>
          )}
          <FilesUpload
            file={flyerInfo.file}
            handleFlyerInfo={handleFlyerInfo}
          />
        </div>
      </div>
      <div className="btn-wrap">
        <button
          className="btn-list-more"
          onClick={handleRegister}
          style={{ background: "rgb(241,101,138)" }}
        >
          등 록
        </button>
      </div>
      {openFlyerModal && (
        <FlyerMapModal
          flyerInfo={flyerInfo}
          handleFlyerInfo={handleFlyerInfo}
          handleFlyerModal={handleFlyerModal}
        />
      )}
    </>
  );
};

export default Register;
