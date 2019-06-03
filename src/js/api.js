import Axios from 'axios';
import qs from 'qs';
/* devblock:start */
import MockAdapter from 'axios-mock-adapter';
import {mockAdapter} from './mockAdapter.js';

var mock = new MockAdapter(Axios,{ delayResponse: 2000 });
    mockAdapter(mock);
/* devblock:end */
const HOST = '';
/**
 * request 工厂
 * @param {*} requireOption   axios config
 * @return function(data) 
 */
function requireFactory(requireOption){
    return (data) =>{
        // console.log(opt,requireOption);
        switch(requireOption.method){
        case 'get':
            requireOption.params = data;
            break;
        case 'post':
            requireOption.data = qs.stringify(data);
            break;
        default:
            requireOption.params = data;
            break;
        }
        // console.log(requireOption);
        return Axios({
            ...requireOption,
        });
    };
}

/**
 * 输入主播波段号发起假如座席
 * data :{
 * 	band
 * 	terminalType  
 * }
 */
export const apiTest = requireFactory({
    url:`${HOST}/test`,
    method:'get',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});