var express = require('express');
var mysql = require("../../common/mysql");
var router = express.Router()
var formidable = require('formidable')

router.use('/maintenance',(Request,Response)=>{
    let labour_id = Request.query.labour_id;
    if(!labour_id){
        Response.send({
            code:403,
            msg:'缺少参数'
        })
        return ;
    }
    let sql = `SELECT customer_id ,real_name,mobile_1,mobile_2,festatus_id,machine_model,fe_model,DATE_FORMAT(last_time,'%Y-%m-%d') AS 'last_time',
    fe_periodicity - DATEDIFF(NOW(),last_time) AS "valid_time",customer_star,customer_area,address ,
    allot_status,labour_name from service 
     where allot_status = '${labour_id}' `;

    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            maintenance:resset
        })
    }).catch(error=>{
        console.error('get maintenance error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })

})

router.use('/accmaintenance',(Request,Response)=>{
    let labour_id = Request.query.labour_id;

    let sql = `select accessory_id,accessory_model,DATE_FORMAT(finish_time,'%Y-%m-%d %h:%i') AS 'finish_time',accmaintain_record,labour_name,sale_id,accessory_id ,accmaintain_status,accmaintain_id ,customer_id, address,real_name ,mobile_1,mobile_2,machine_model from accmaintenance where labour_id = '${labour_id}' and accmaintain_status = 0 order by finish_time desc`;
    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            accmaintenance:resset
        })
    }).catch(error=>{
        console.error('get maintenance error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})



router.use('/finishedmaintenance',(Request,Response)=>{
    let labour_id = Request.query.labour_id;
    if(!labour_id){
        Response.send({
            code:403,
            msg:'缺少参数'
        })
        return ;
    }
    let sql = `SELECT 
    machine_id,DATE_FORMAT(maintain_time,'%Y-%m-%d %h:%i') AS 'maintain_time',maintain_status,labour_id,labour_name ,
    festatus_id ,allot_status,customer_id,real_name,machine_code,maintain_record,address,
    machine_model ,labour_avatarUrl,fe_model,fe_id ,maintain_for ,sale_id from maintenance where labour_id = '${labour_id}' order by maintain_time desc`;

    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            maintenance:resset
        })
    }).catch(error=>{
        console.error('get maintenance error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })

})

router.use('/finishedaccmaintenance',(Request,Response)=>{
    let labour_id = Request.query.labour_id;

    let sql = `select accessory_id,accessory_model,DATE_FORMAT(finish_time,'%Y-%m-%d %h:%i') AS 'finish_time',accmaintain_record,labour_name,sale_id,accessory_id ,accmaintain_status,accmaintain_id ,customer_id, address,real_name from accmaintenance where labour_id = '${labour_id}' order by finish_time desc`;
    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            accmaintain:resset
        })
    }).catch(error=>{
        console.error('get maintenance error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})


module.exports = router;