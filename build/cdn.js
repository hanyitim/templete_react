var axios = require('axios');
var qs = require('qs');
var projectConfig = require('./project.config.js');

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF_8';
axios({
    method:'post',
    url:'http://flushcdnoffice.lizhi.fm/',
    data:qs.stringify({
        qq:"00",
        ws:"01",
        SecretKey:"*****",
        flushurl:`${projectConfig.cdnUrls.join(";")}`
    })
})
.then((res)=>{
    console.log(res.data);
})
.catch((err)=>{
    console.log(err.code);
})
