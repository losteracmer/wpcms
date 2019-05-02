const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use('/getlist',(Request,Response)=>{
    
    let sql = `select * from accessories`;

    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            accessories:resset
        })
    }).catch(error=>{
        console.error('accessories getlist错误',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})



router.use('/addmaintain',(Request,Response)=>{
    console.log('==============add acc maintain',Request.query)
    let accessory_id =  Request.query.accessoryId ;
    let labour_id = Request.query.labourId;
    let sale_id = Request.query.sale_id;
    if(!accessory_id||!labour_id||!sale_id){
        Response.send({
            code:403,
            msg:'缺少参数，请核查'
        });
        return ;
    }
    let sql = `insert into accmaintain(accessory_id,accmaintain_labour,sale_id,accmaintain_status,create_time) values(?,?,?,?,?)`;
    let par = [accessory_id,labour_id,sale_id,0,new Date()];
    mysql.insert(sql,par).then(result =>{
        Response.send({
            code:200,
            msg:'派工成功，维护记录插入成功，维护状态:[未完成]'
        })
    }).catch(error=>{
        console.error('add acc maintain error:',error)
        Response.send({
            code:500,
            msg:'服务器错误'
        })    
    })
    
})

router.use('/setaccmaintainfinish',(Request,Response)=>{
    let accmaintain_id = Request.query.accmaintain_id;

    let sql = `update accmaintain set accmaintain_status = ? ,finish_time = ? where accmaintain_id = ?`;
    let par = [1,new Date(),accmaintain_id];
    mysql.update(sql,par).then(result =>{
        Response.send({
            code:200,
            msg:'以设置为完成'
        })
    }).catch(error=>{
        Response.send({
            code:500,
            msg:'服务器错误，设置失败'
        })
    })
})

module.exports =router;