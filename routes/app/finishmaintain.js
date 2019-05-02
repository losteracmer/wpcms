let express = require('express');
let mysql = require("../../common/mysql");
let router = express.Router();

router.use('/maintenance', async (Request, Response) => {
    let labour_id = Request.query.labour_id;
    let maintain_record = Request.query.maintain_record;
    let festatus_id = Request.query.festatus_id;

    // let sql2 = `insert into maintain(maintain_time,maintain_status,labour_id,maintain_for,maintain_record) values(?,?,?,?,?)`;
    // let par = [new Date(), 1, labour_id, festatus_id, maintain_record];
    // mysql.insert(sql2, par).then(result => {
    //     Response.send({
    //         code: 200,
    //         msg: '完成任务！'
    //     })
    // }).catch(error => {
    //     console.log('app set maintain finish error:', error);
    //     Response.send({
    //         code: 500,
    //         msg: '服务器错误,稍后重试吧~'
    //     })
    // })


    //做记录，并且同步storage 数量
    let connection = await mysql.connectionp();
    connection.beginTransaction();
    try{
        let sql2 = `insert into maintain(maintain_time,maintain_status,labour_id,maintain_for,maintain_record) values(?,?,?,?,?)`;
        let par = [new Date(), 1, labour_id, festatus_id, maintain_record];
        let rr =await connection.query(sql2, par);
        console.log("rr:", rr);

        let sqlGetFeId = `select * from festatus where festatus_id = ?`;
        let festatus = await connection.query(sqlGetFeId,[festatus_id]);
        console.log(festatus);

        let fe_id = festatus[0].fe_id;

        let sqlSelect = `select * from labourstorage where labour_id = ? and fe_id = ? `;
        let labourstorages = await connection.query(sqlSelect, [labour_id, fe_id]);
        if(labourstorages.length === 0){
            let sqlInsert = `insert into labourstorage (labour_id,fe_id,quantity) values(?,?,?)`;
            let result = await connection.query(sqlInsert,[labour_id,fe_id,0]);
            console.log("插入labourStorage result ", result);
        }
        let sqlUpdate = `update labourstorage set quantity = quantity + ? where labour_id = ? and fe_id = ?`;
        //这里是消耗掉一个，所以数量减1
        let result2 = await connection.query(sqlUpdate, [-1, labour_id, fe_id]);

        let sqlLog = `insert into labourstoragechangelog(labour_id,fe_id,record_time,record_reason,change_sum) values(?,?,?,?,?)`;
        let result3 = await connection.query(sqlLog, [labour_id, fe_id, new Date(), "finish maintenance to " + festatus[0].sale_id +" record : "+ maintain_record, -1]);
        connection.commit();
        Response.send({
            code: 200,
            msg: '完成任务！'
        })
    }catch (e) {
        console.log("事务出错: ",e);
        connection.rollback();
        Response.send({
            code: 500,
            msg: '服务器出错！'
        })
    }

});

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
});

/*
完成用户级别（订单级别）的维护。
*/
router.use('/customer',async(Request, Response) =>{
    let labour_id = Request.query.labour_id;
    let customer_id = Request.query.customer_id;
    let record = Request.query.record;
    //获取用户id ，将次用户所有订单 labour_id 志为空，时间更新
    let sql1 = `UPDATE sales SET maintain_labour = NULL ,last_maintain = NOW() WHERE customer_id = ? `;
    let updateResult = await mysql.update(sql1,[customer_id]);

    let sql2 = `INSERT INTO customermaintain (customer_id,labour_id,maintain_time,record) VALUES(?,?,?,?)`;
    let par2 = [customer_id,labour_id,new Date(),record];

    let insertResult = await mysql.insert(sql2,par2);
    console.log("插入结果",insertResult);
    //保存数据库
    Response.send({
        code:200,
        msg:"更新成功"
    })
    

});
module.exports = router;