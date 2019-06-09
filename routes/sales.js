/*
    订单的控制
    每增加一个订单，要在festatus表中存一个机器对应的所有滤芯
*/
const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/get",(Request,Response)=>{
    console.log('order get query ',Request.query)
    let sale_id = Request.query.sale_id;
    if(!sale_id){
        Response.send({
            code:403,
            msg:'缺少参数'
        })
        return;
    }
    let sql = `select * from sales where sale_id = ${sale_id}`;
    mysql.query(sql).then(resset=>{
        if(resset.length == 0){
            Response.send({
                code:403,
                msg:'未找到此订单'
            })
            return ;
        }
        Response.send({
            code:200,
            detail:resset[0]
        })
    }).catch(error =>{
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})

router.use("/getorderlistajax",(Request,Response)=>{
    let sql = `select sale_id,real_name,machine_model,machine_code,DATE_FORMAT(sale_time,'%Y %m %d %H:%i')AS 'sale_time',sale_store from orders`;
    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            data:resset
        })
    }).catch(error=>{
        console.log('get order list ajax error:',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
        
    })

})

router.use("/customerorder",(Request,Response)=>{
    let customer_id = Request.query.customer_id;
    if(!customer_id){
        Response.send({
            code:403,
            msg:'缺少参数'
        })
        return ;
    }
    let sql = `select sale_id,real_name,machine_model,machine_code,DATE_FORMAT(sale_time,'%Y %m %d %H:%i')AS 'sale_time',sale_store ,DATE_FORMAT(last_maintain,'%Y-%m-%d')AS 'last_maintain' from orders where customer_id = ${customer_id}`;
    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            order:resset
        })
    }).catch(error=>{
        console.log('get order customer list :',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
        
    })

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
    let sale_time = body.sale_time||new Date();
    let sale_remark = body.sale_remark;
    let machine_id = body.machine_id;
    let timeCode = (new Date()).getTime();
    console.log(timeCode);
    
    
    let sql = `insert into sales(sale_id,customer_id,machine_code,sale_store,sale_time,sale_remark,machine_id,last_maintain) values(?,?,?,?,?,?,?,?)`;
    let par = [timeCode,customer_id,machine_code,sale_store,sale_time,sale_remark,machine_id,sale_time];

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
    let sale_id=Request.query.sale_id;
    let sql = `delete from sales where sale_id = ${sale_id}`;
    mysql.query(sql).then(result =>{
        Response.send({
            code:200,
            msg:'删除订单成功'
        })
    }).catch(error=>{
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})


module.exports = router;