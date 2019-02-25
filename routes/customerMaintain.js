const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use('/getlist',(Request,Response)=>{
    let sql = `select sales.customer_id,machine_model,sale_time,DATE_FORMAT(last_maintain,'%Y-%m-%d') as last_maintain,maintain_labour,labour_name,customer_from,customer_star,real_name,mobile_1,mobile_2,customer_area,address ,IF(maintain_sum is null,0,maintain_sum) AS maintain_sum  
    from sales LEFT JOIN labour ON labour.labour_id = sales.maintain_labour 
     LEFT JOIN (SELECT sale_id, count(*) AS 'maintain_sum' FROM maintain,festatus WHERE maintain_for = festatus_id GROUP BY sale_id) AS maintain_log ON maintain_log.sale_id = sales.sale_id
    ,customer,machine 
    where sales.customer_id = customer.customer_id AND machine.machine_id = sales.machine_id`

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
    let lazyshow = Request.query.lazyshow;  //是否显示僵尸用户
    let validshow = Request.query.validshow; //是否显示没到期用户
    let allotshow = Request.query.allotshow; // 是否只显示派工客户
    let period = Request.query.period||180;
    let sqlpartV = ` AND( DATEDIFF(NOW(),last_maintain) >= ${period} OR last_maintain IS NULL) `;
    let sqlpartA = ` AND maintain_labour is not null `;
    let sqlpartJ = ` AND customer_status = 0 `
    let sql = `select sales.customer_id,sales.sale_id,machine_model,sale_time,IF(last_maintain is null,'未知',DATE_FORMAT(last_maintain,'%Y-%m-%d')) as last_maintain,maintain_labour,labour_name,customer_from,customer_star,real_name,mobile_1,mobile_2,customer_area,address ,IF(maintain_sum is null,0,maintain_sum) AS maintain_sum  
    from sales LEFT JOIN labour ON labour.labour_id = sales.maintain_labour 
     LEFT JOIN (SELECT sale_id, count(*) AS 'maintain_sum' FROM maintain,festatus WHERE maintain_for = festatus_id GROUP BY sale_id) AS maintain_log ON maintain_log.sale_id = sales.sale_id
    ,customer,machine 
    where sales.customer_id = customer.customer_id AND machine.machine_id = sales.machine_id ${lazyshow=='true'?sqlpartJ:""} 
    ${validshow=='true'?sqlpartV:""} ${allotshow=='true'?sqlpartA:""}
    `

    console.log(sql)
    mysql.query(sql).then(resset =>{
        Response.send({
            data:resset
        })
    }).catch(error=>{
        console.error("maintain list 错误:",error);
        Response.send({
            code:500
        })
    })
})


router.use('/delayremind',(Request,Response)=>{
    console.log("/delayremind",Request.query);
    let delaytime = Request.query.delaytime||new Date();
    let sale_id = Request.query.sale_id;
    console.log('update delay time :',delaytime,"  ",sale_id);
    
    let sql = `UPDATE sales set last_maintain = ? where sale_id = ?`;
    let par = [delaytime,sale_id];
    
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
    let sale_id = Request.query.sale_id;
    console.log(labourId,'  ',sale_id)
    let sql = `update sales set maintain_labour = ? where sale_id = ?`;
    let par = [labourId,sale_id]
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
    let sale_id = Request.query.sale_id;

    let sql = `select sales.customer_id from sales where sale_id = ${sale_id} `;
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

