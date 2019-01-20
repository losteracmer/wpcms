/*
    客户的增删改查
*/
const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/getdetail",(Request,Response)=>{
    let customer_id = Request.query.customer_id;
    let sql = `select * from customer where customer_id = ${customer_id}`;

    mysql.query(sql).then(resset=>{
        if(resset.length == 0){
            Response.send({
                code:403,
                msg:'没有找到这个用户'
            });
        }else{
            Response.send({
                code:200,
                detail:resset[0]
            })
        }
    }).catch(error=>{
        console.error('customer getdetail error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})
router.use("/getlist",(Request,Response)=>{
    
})


router.use("/change",(Request,Response)=>{
    let queryObj = Request.body;
    console.log('change customer: ',queryObj);
    let real_name = queryObj.real_name;
    let mobile_1 = queryObj.mobile_1;
    let mobile_2 = queryObj.mobile_2;
    let address = queryObj.address;
    let customer_from = queryObj.customer_from;
    let customer_star = queryObj.customer_star;
    let customer_id = queryObj.customer_id;

    let sql = `update customer set real_name =?, mobile_1 = ?,mobile_2 =?,address = ?,customer_from =?,customer_star=? where customer_id=? `;
    let par = [real_name,mobile_1,mobile_2,address,customer_from,customer_star,customer_id];
    mysql.update(sql,par).then(result=>{
        console.log(result)
        if(result.affectedRows == 1){
            Response.send({
                code:200,
                msg:'更改'+real_name+'信息成功'
            })
        }else {
            Response.send({
                code:403,
                msg:'更改失败'
            })
        }
    }).catch(error=>{
        console.log('change customer error:',error)
        Response.send({
            code:500,
            msg:'更改失败,服务器错误'
        })
    })

})

router.use("/add",(Request,Response)=>{
    
})

router.use("/delete",(Request,Response)=>{
    
})


module.exports=router;