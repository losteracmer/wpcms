const express = require('express');
const router = express.Router();
const mysql = require('../../common/mysql');

router.use('/customer',async (Request,Response)=>{
    console.log("app labour login");

    let text = Request.query.text;

    let sql = `SELECT * FROM customer WHERE real_name = '${text}' or mobile_1 = '${text}' or mobile_2 = '${text}' or remark = '${text}' or customer_id = '${text}' limit 0 ,100`;
    let customerList = await mysql.query(sql);
    if (customerList.length == 0) {
        Response.send({
            code:403,
            msg:'没有找到相关用户',
            customerList:customerList
        });
        return ;
    }else {
        Response.send({
            code:200,
            customerList:customerList
        })
    }



})

module.exports =router;