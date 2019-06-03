exports.mockAdapter = function(mock){
    mock.onGet('/test').reply(200,{
        rCode:0,
        data:{
            test:1
        }
    });
};