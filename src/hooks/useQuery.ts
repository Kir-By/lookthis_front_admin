import Axios from 'utils/Axios'
import { RES_DATA_TYPE, RequestParams } from 'types/common'
// import { Modal } from 'common/modal'

const axiosGet = async (url: string, params?: Object, axiosConfig?: Object) => {
    return await Axios.get(url, JSON.stringify(params), axiosConfig)
}

const axiosPost = async (url: string, params: Object, axiosConfig?: Object) => {
    return await Axios.post(url, JSON.stringify(params), axiosConfig)
}

const getDataList = async (params: Object) => {
    const { data } = await Axios.postData(
        `${process.env.REACT_APP_SERVER_DOMAIN}/query`,
        JSON.stringify(params),
        null,
        RES_DATA_TYPE.LIST,
        false,
    )
    return data
}

const getData = async (params: Object) => {
    const { data } = await Axios.postData(
        `${process.env.REACT_APP_SERVER_DOMAIN}/query`,
        JSON.stringify(params),
        null,
        RES_DATA_TYPE.OBJECT,
        false,
    )
    return data
}

const getDataOutputList = async (params: Object) => {
    const { data } = await Axios.postData(
        `${process.env.REACT_APP_SERVER_DOMAIN}/query`,
        JSON.stringify(params),
        null,
        RES_DATA_TYPE.LIST,
        true,
    )
    return data
}

const getDataOutput = async (params: Object) => {
    const { data } = await Axios.postData(
        `${process.env.REACT_APP_SERVER_DOMAIN}/query`,
        JSON.stringify(params),
        null,
        RES_DATA_TYPE.OBJECT,
        true,
    )
    return data
}

const fetchLogin = async (params: RequestParams<Object>) => {
    const { data } = await Axios.postData(
        `${process.env.REACT_APP_SERVER_DOMAIN}/login`,
        JSON.stringify(params),
        null,
        RES_DATA_TYPE.LIST,
        true,
    )
    return data
}

const getCookie = async () => {
    const response = await Axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}/getlogincookie`, null, null)
    return response
}

const axiosError = (err:any) => {
    // Modal.push({ type: 'COMMON_CONFIRM', title: '알림', render: err.response.data||'데이터 조회시 오류가 발생하였습니다.', confirm: () => { Modal.close('COMMON_CONFIRM'); }})
}

export const queryFn = {
    axiosGet,
    axiosPost,
    getDataList,
    getData,
    getDataOutputList,
    getDataOutput,
    fetchLogin,
    getCookie,
    axiosError
}
