const RES_DATA_TYPE = {
    LIST: 0,
    OBJECT: 1,
}

const MODAL_TYPES = {
    // 모달 타입
    COMMON: 'COMMON',
    COMMON_CONFIRM : 'COMMON_CONFIRM',
    CONFIRM: 'CONFIRM',
    SEARCH_ADDRESS: 'SEARCH_ADDRESS',
    ORDER_INFO: 'ORDER_INFO',
    ORDER_NEWTLY: 'ORDER_NEWTLY',
    ORDER_AFFILIATE: 'ORDER_AFFILIATE',
    ORDER_CONFIRM: 'ORDER_CONFIRM',
    ORDER_COMPLETE: 'ORDER_COMPLETE',
    ORDER_CANCEL: 'ORDER_CANCEL',
    RECOMMEND_VEHICLE: 'RECOMMEND_VEHICLE',
    MILEAGE: 'MILEAGE',
    CHOICE_TRUCK: 'CHOICE_TRUCK',
    NEED_LOGIN: 'NEED_LOGIN',
    NOTICE_MODAL: 'NOTICE_MODAL',
    RESERVATION: 'RESERVATION',
    // 로그인 관련 모달
    AUTHENTICATION: 'AUTHENTICATION',
    FORGET_AUTH: 'FORGET_AUTH',
    MODIFY_INFO: 'MODIFY_INFO',
    PRIVACY: 'PRIVACY',
    REGISTER_SOCIAL: 'REGISTER_SOCIAL',
}

interface RequestParams<T> {
    ws: String
    query: String
    params: T
}

type AddressHistoryInfo = {
    t_id: number
    group_no: number
    cust_no: number
    result_type: number
    dong_id: number
    dong_name: string
    poi_name: string
    jibun_address: string
    road_address: string
    pos_x: number
    pos_y: number
}

type DistanceParams = DistanceSearchParams & DistanceDefaultParams

type DistanceSearchParams = {
    StartPosX : number
    StartPosY : number
    DestPosX : number
    DestPosY : number
} 

type DistanceDefaultParams = {
    PosBessel : number
    Via1PosX : number
    Via1PosY : number
    Via2PosX : number
    Via2PosY : number
    Via3PosX : number
    Via3Posy : number
    ResType : number
} 

type CarChargeSearchParams = {
    nCompany: number,
    nStartID: number,
    nDestID: number,
    nCarType: number,
    fKm: number
}

type CommandType = 'CREATE' | 'DELETE'

export { RES_DATA_TYPE, MODAL_TYPES }

export type { RequestParams, AddressHistoryInfo, CommandType, DistanceSearchParams, DistanceParams, CarChargeSearchParams }
