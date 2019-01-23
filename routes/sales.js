/*
    订单的控制
    每增加一个订单，要在festatus表中存一个机器对应的所有滤芯
*/
const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/get",(Request,Response)=>{

})

router.use("/getlist",(Request,Response)=>{


})


router.use("/update",(Request,Response)=>{
    
})

router.use("/add",(Request,Response)=>{

    console.log('new order !!');
    let body = Request.body;
    //console.log('crete order body: ',body)
    let customer_id = body.customer_id;
    let machine_code = body.machine_code;
    let sale_store = body.sale_store;
    let sale_time = body.sale_time;
    let sale_remark = body.sale_remark;
    let machine_id = body.machine_id;

    let sql = `insert into sales(customer_id,machine_code,sale_store,sale_time,sale_remark,machine_id) values(?,?,?,?,?,?)`;
    let par = [customer_id,machine_code,sale_store,sale_time,sale_remark,machine_id];

    mysql.insert(sql,par).then(result =>{
        Response.send({
            code:200,
            msg:'创建订单成功'
        })
    }).catch(error=>{
        console.error('create order error',error);
        
        Response.send({
            code:500,
            msg:'服务器错误,创建订单失败!'
        })
        
    })
    
})

router.use("/delete",(Request,Response)=>{
    
})


module.exports = router;