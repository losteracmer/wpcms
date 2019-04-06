var express = require('express');
var mysql = require("../../common/mysql");
var router = express.Router()

router.use('/maintenance', (Request, Response) => {
    let labour_id = Request.query.labour_id;
    let maintain_record = Request.query.maintain_record;
    let festatus_id = Request.query.festatus_id;

    let sql2 = `insert into maintain(maintain_time,maintain_status,labour_id,maintain_for,maintain_record) values(?,?,?,?,?)`;
    let par = [new Date(), 1, labour_id, festatus_id, maintain_record];
    mysql.insert(sql2, par).then(result => {
        Response.send({
            code: 200,
            msg: '完成任务！'
        })
    }).catch(error=>{
        console.log('app set maintain finish error:',error);
        Response.send({
            code:500,
            msg:'服务器错误,稍后重试吧~'
        })
    })
})

router.use('/accmaintenance', (Request, Response) => {
    let labour_id = Request.query.labour_id;
    let accmaintain_record = Request.query.accmaintain_record;
    let accmaintain_id = Request.query.accmaintain_id;

    let sql = `update accmaintain set accmaintain_status = ? ,finish_time = ? ,accmaintain_record=? where accmaintain_id = ?`;
    let par = [1,new Date(),accmaintain_record,accmaintain_id];
    mysql.update(sql,par).then(result =>{
        Response.send({
            code:200,
            msg:'完成任务！'
        })
    }).catch(error=>{
        console.error('app set finish accmaintain error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误，稍后重试吧'
        })
    })
})

/*
完成用户级别（订单级别）的维护。
*/
router.use('/customer',async(Request, Response) =>{
    let labour_id = Request.query.labour_id;
    let customer_id = Request.query.customer_id;
    let record = Request.query.record;
    //获取用户id ，将次用户所有订单 labour_id 志为空，时间更新
    let sql1 = `UPDATE sales SET maintain_labour = NULL ,last_maintain = NOW() WHERE customer_id = ? `
    let updateResult = await mysql.update(sql1,[customer_id]);

    let sql2 = `INSERT INTO customermaintain (customer_id,labour_id,maintain_time,record) VALUES(?,?,?,?)`;
    let par2 = [customer_id,labour_id,new Date(),record]

    let insertResult = await mysql.insert(sql2,par2);
    //保存数据库
    Response.send({
        code:200,
        msg:"更新成功"
    })
    

})
module.exports = router;