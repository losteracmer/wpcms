const express = require('express');
const events = require('events');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/getnavigation",async(Request,Response)=>{
    let sql = `select * from navi_main,navi_son where navi_main.navi_main_id = navi_father GROUP BY navi_main_top,navi_son_top`;
    try {
        let naviList = await mysql.query(sql);
        Response.send({
            code:200,
            naviList:naviList
        })
    } catch (error) {
        Response.send({
            code:500,
            msg:"服务器错误,获取导航栏失败"
        })
    }
})

module.exports = router;