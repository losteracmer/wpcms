const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use('/getlist',(Request,Response)=>{
    
    let sql = `select * from labour`;

    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            labourlist:resset
        })
    }).catch(error=>{
        console.error('labour getlist错误',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })


})



module.exports =router;