const express = require('express');
const router = express.Router();
const mysql = require('../../common/mysql');

router.use('/labourlogin',(Request,Response)=>{
    console.log("app labour login");
    
    let body = Request.body;
    let labour_id = body.labour_id;
    let labour_pw = body.labour_pw;

    let sql = `select * from labour where labour_id = '${labour_id}'`;
    mysql.query(sql).then(resset =>{
        if(resset.length == 0){
            Response.send({
                code:200,
                msg:'没有找到此用户'
            })
            return ;
        }
        if(resset[0].labour_pw == labour_pw){
            Response.send({
                code:200,
                msg:'登录成功'
            })
        }
    })



})

module.exports =router;