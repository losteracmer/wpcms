//获取  工人维护客户列表

var express = require('express');
var mysql = require("../../common/mysql");

var router = express.Router()

router.use('/list',async (Request,Response)=>{
    let labour_id = Request.query.labour_id;
    if(!labour_id){
        Response.send({
            code:403,
            msg:'缺少参数'
        })
        return ;
    }
    let sql = `SELECT sales.customer_id,real_name,mobile_1 ,address 
    FROM sales,customer WHERE sales.customer_id = customer.customer_id AND sales.maintain_labour = '${labour_id}'`

    let workList = await mysql.query(sql);
    console.log("workList:",workList);
    Response.send({
        code:200,
        workList:workList,
        msg:"success"
    })

})


module.exports = router;