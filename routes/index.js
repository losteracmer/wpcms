const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use('/getlist',(Request,Response)=>{
    let sql = `SELECT customer_id ,real_name,mobile_1,mobile_2,festatus_id,machine_model,fe_model,DATE_FORMAT(last_time,'%Y-%m-%d') AS 'last_time',
    fe_periodicity - DATEDIFF(NOW(),last_time) AS "valid_time",customer_star,customer_area,address ,
    allot_status,labour_name from service where (lazy_time<NOW() OR lazy_time IS NULL) 
    ORDER BY DATE_ADD(last_time,INTERVAL fe_periodicity DAY)`

    mysql.query(sql).then(resset =>{
        Response.send({
            code:200,
            list:resset
        })
    }).catch(error=>{
        console.error("index list 错误:",error);
        Response.send({
            code:500
        })
    })
})

router.use('/getlistajax',(Request,Response)=>{
    let sql = `SELECT customer_id ,real_name,mobile_1,mobile_2,festatus_id,machine_model,fe_model,DATE_FORMAT(last_time,'%Y-%m-%d') AS 'last_time',
    fe_periodicity - DATEDIFF(NOW(),last_time) AS "valid_time",customer_star,customer_area,address ,
    allot_status,labour_name from service where (lazy_time<NOW() OR lazy_time IS NULL) 
    ORDER BY DATE_ADD(last_time,INTERVAL fe_periodicity DAY)`

    mysql.query(sql).then(resset =>{
        Response.send({
            data:resset
        })
    }).catch(error=>{
        console.error("index list 错误:",error);
        Response.send({
            code:500
        })
    })
})


router.use('/delayremind',(Request,Response)=>{

    let delaytime = Request.query.delaytime;
    let fesid = Request.query.fesid;
    console.log('update delay time :',delaytime,"  ",fesid);
    let now = new Date()
    now.setDate(now.getDate()+delaytime*1);
    
   
    let sql = `UPDATE festatus set lazy_time = ? where festatus_id = ?`;
    let par = [now,fesid];
    
    mysql.update(sql,par).then(result=>{
        console.log("设置成功!");
        Response.send({
            code:200,
            msg:'设置成功'
        })
    }).catch(error=>{
        console.log("error:'",error);
        
        Response.send({
            code:500,
            msg:'设置失败，服务器错误'
        })
    })
})

router.use('/setlabour',(Request,Response)=>{
    let labourId = Request.query.labourId;
    let fesid = Request.query.fesid;
    console.log(labourId,'  ',fesid)
    let sql = `update festatus set allot_status = ? where festatus_id = ?`;
    let par = [labourId,fesid]
    mysql.update(sql,par).then(result=>{
        console.log("派工成功!",result);
        Response.send({
            code:200,
            msg:'派工成功'
        })
    }).catch(error=>{
        console.log("error:'",error);
        
        Response.send({
            code:500,
            msg:'派工失败，服务器错误'
        })
    })
})

router.use('/getcustomerid',(Request,Response)=>{
    let fesid = Request.query.fesid;

    let sql = `select sales.customer_id from festatus,sales where festatus_id = ${fesid} and festatus.sale_id = sales.sale_id`;
    mysql.query(sql).then(resset=>{
        if(resset.length == 0){
            Response.send({
                code:403,
                msg:'没有找到此用户'
            })
        }else {
            Response.send({
                code:200,
                customer_id :resset[0].customer_id
            })
        }
    }).catch(error=>{
        Response.send({
            code:500,
            msg:'系统错误'
        })
    })
})

module.exports =router;
