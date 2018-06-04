const config = {
    page:{
        path:"./src/page",
        pageInfo:{
            temp_index:{
                title:"page模板"
            }
        }
    },
    mock:{
        path:"./mock",
        isuse:true
    },
    widget:{
        page:"./src/widget"
    },
    common:{
        vender:['react','react-dom']
    },
    isSPA:{
        isuse:true
    }
}

module.exports = config;