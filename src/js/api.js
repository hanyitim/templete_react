import Axios from 'axios';
import qs from 'qs';

Axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
const HOST = '';
/**
 * request 工厂
 * @param {*} requireOption   axios config
 * @return function(data) 
 */
function requireFactory(requireOption){
    return (data,subUrl) =>{
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
        if(subUrl){
            requireOption.url = requireOption.url.replace('$path',subUrl);
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
    method:'get'
});
