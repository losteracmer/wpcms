var express = require('express');
var mysql = require("../../common/mysql");
var lastVersion = require('../../config.js').lastVersion;
var router = express.Router()

router.use('/check',(Request,Response)=>{
    let nowVersion = Request.query.nowVersion;
    if(nowVersion<lastVersion){
        Response.send({
            code:201,
            msg:'检查到有新版本，请前往电脑客户端更新'
        })
    }else if(nowVersion == lastVersion){
        Response.send({
            code:200,
            msg:'当前版本就是最新版本啦~~~'
        })
    }
    
})


module.exports = router;