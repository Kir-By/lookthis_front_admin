import axios from 'axios'
// import axios_jsonp from 'axios-jsonp-pro';
import { RES_DATA_TYPE } from 'types/dataType'

export default class Axios {
    static get = (url, params, axiosConfig, jwt) => {
        if (axiosConfig === null || axiosConfig === '' || typeof axiosConfig === 'undefined') {
            axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json; charset=UTF-8',
                    Authorization: 'Bearer ' + jwt,
                },
                params,
            }
        }
        return axios.get(url, axiosConfig).then(function (json) {
            return json.data
        })
    }

    static post = (url, params, axiosConfig, jwt) => {
        if (axiosConfig === null || axiosConfig === '' || typeof axiosConfig === 'undefined') {
            axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json; charset=UTF-8',
                    Authorization: 'Bearer ' + jwt,
                },
            }
        }
        return axios.post(url, params, axiosConfig).then(function (json) {
            return json.data
        })
    }
    
    static put = (url, params, axiosConfig, jwt) => {
        console.log('jwt',jwt)
        if (axiosConfig === null || axiosConfig === '' || typeof axiosConfig === 'undefined') {
            axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json; charset=UTF-8',
                    Authorization: 'Bearer ' + jwt,
                },
            }
        }
        return axios.put(url, params, axiosConfig).then(function (json) {
            return json.data
        })
    }

    static postData = (url, params, axiosConfig, dataType, outPutParams) => {
        if (axiosConfig === null || typeof axiosConfig === 'undefined') {
            axiosConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json; charset=UTF-8',
                },
            }
        }
        return axios.post(url, params, axiosConfig).then(function (json) {
            console.log(`success(query: ${JSON.parse(json.config.data)?.query}) : `, json)
            const columns = json.data.columns ? json.data.columns.map((d) => {
                return d.name
            }) : {}
            let resultDataList = json.data.rows ? json.data.rows.map((rowObj) => {
                let obj = {}
                columns.forEach((element, idx) => {
                    obj[element] = rowObj[idx]
                })
                return obj
            }) : []

            // Output 파라미터 사용할 경우.
            if (outPutParams) {
                if (dataType === RES_DATA_TYPE.LIST) {
                    json.data = {
                        list: resultDataList,
                        out: json.data.params,
                        return: json.data.return
                    }
                } else if (dataType === RES_DATA_TYPE.OBJECT) {
                    json.data = {
                        dataObj: resultDataList[0],
                        out: json.data.params,
                        return: json.data.return,
                    }
                }
            } else {
                if (dataType === RES_DATA_TYPE.LIST) {
                    json.data = resultDataList
                } else if (dataType === RES_DATA_TYPE.OBJECT) {
                    json.data = resultDataList[0]
                }
            }

            return json
        })
    }

    // static getJsonp = (url, params, axiosConfig, callback) => {
    //     if(axiosConfig === null || typeof axiosConfig === 'undefined'){
    //         axiosConfig = {
    //             headers : {
    //                 "Content-Type": "application/json",
    //                 'Accept': "application/json; charset=UTF-8"
    //             }
    //         }
    //     }
    //     return axios_jsonp.jsonp(url, params, axiosConfig)
    //     .then( function(json) {
    //         callback(json);
    //     })
    //     .catch((err) => { console.log("Axios[JSONP] Error : ",err);});
    // };
}
