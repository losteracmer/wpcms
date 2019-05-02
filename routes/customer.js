/*
    客户的增删改查
*/
const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/getdetail",(Request,Response)=>{
    let customer_id = Request.query.customer_id;
    if(!customer_id){
        Response.send({
            code:302,
            href:'/customer_list.html'
        })
    }
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
router.use("/getlistajax",(Request,Response)=>{
    let sql = `select * from customer`;

    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            data:resset
        })
    }).catch(error=>{
        console.error('get customer list ajax error:',error);
        Response.send({
            code:500,
            msg:'服务错误'
        })
    })
})
router.use("/getlist",(Request,Response)=>{
    let sql = `select * from customer`;

    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            customerlist:resset
        })
    }).catch(error=>{
        console.error('get customer list error:',error);
        Response.send({
            code:500,
            msg:'服务错误'
        })
    })
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
    let remark = queryObj.remark;
    let sql = `update customer set real_name =?, mobile_1 = ?,mobile_2 =?,address = ?,customer_from =?,customer_star=?,remark = ? where customer_id=? `;
    let par = [real_name,mobile_1,mobile_2,address,customer_from,customer_star,remark,customer_id];
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
    let queryObj = Request.body;
    console.log('add customer: ',queryObj);
    let real_name = queryObj.real_name;
    let mobile_1 = queryObj.mobile_1;
    let mobile_2 = queryObj.mobile_2;
    let address = queryObj.address;
    let customer_area = queryObj.customer_area;
    let customer_from = queryObj.customer_from;
    let customer_star = queryObj.customer_star;
    let remark = queryObj.remark;

    let customer_id = (new Date()).getTime();
    let sql = `insert into customer(customer_id,real_name , mobile_1 ,mobile_2 ,customer_area,address ,customer_from ,customer_star,remark,create_time)  values(?,?,?,?,?,?,?,?,?,?) `;
    let par = [customer_id,real_name,mobile_1,mobile_2,customer_area,address,customer_from,customer_star,remark,new Date()];
    mysql.update(sql,par).then(result=>{
        console.log(result)
        if(result.affectedRows == 1){
            Response.send({
                code:200,
                customer_id :customer_id,
                msg:'添加新客户成功'
            })
        }else {
            Response.send({
                code:403,
                msg:'添加失败'
            })
        }
    }).catch(error=>{
        console.log('change customer error:',error)
        Response.send({
            code:500,
            msg:'添加失败,服务器错误'
        })
    })

})


router.use("/delete",(Request,Response)=>{
    let customer_id = Request.query.customer_id;

    let sql = `delete from customer where customer_id = ?`
    let par = [customer_id];
    
    mysql.update(sql,par).then(result=>{
        Response.send({
            code:200,
            msg:'删除成功'
        })
        
    }).catch(error=>{
        console.error('delete customer error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})

router.use('/maintenance',(Request,Response)=>{
    let customer_id = Request.query.customer_id;
    let sql = `SELECT 
    machine_id,DATE_FORMAT(maintain_time,'%Y-%m-%d %H:%i') AS 'maintain_time',maintain_status,labour_id,labour_name ,
    festatus_id ,allot_status,customer_id,real_name,machine_code,maintain_record,
    machine_model ,labour_avatarUrl,fe_model,fe_id ,maintain_for ,sale_id from maintenance where customer_id = ${customer_id}`;

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

//获取用户的配件维修记录
router.use('/accmaintenance',(Request,Response)=>{
    let customer_id = Request.query.customer_id;

    let sql = `select accessory_id,accessory_model,DATE_FORMAT(finish_time,'%Y-%m-%d %H:%i') AS 'finish_time',accmaintain_record,labour_name,sale_id,accessory_id ,accmaintain_status,accmaintain_id from accmaintenance where customer_id = ${customer_id} order by finish_time desc`;
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

router.use('/setlazy',(Request,Response)=>{
    let customer_id = Request.query.customer_id;

    let sql = `update customer set customer_status = -1 where customer_id = ?`
    let par = [customer_id];
    
    mysql.update(sql,par).then(result=>{
        Response.send({
            code:200,
            msg:'设置成功'
        })
        
    }).catch(error=>{
        console.error('set customer lazy error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})

router.use('/setunlazy',(Request,Response)=>{
    let customer_id = Request.query.customer_id;

    let sql = `update customer set customer_status = 0 where customer_id = ?`
    let par = [customer_id];
    
    mysql.update(sql,par).then(result=>{
        Response.send({
            code:200,
            msg:'设置用户正常成功'
        })
        
    }).catch(error=>{
        console.error('set customer lazy error:',error);
        
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})

router.use("/getfestatus",async (Request,Response)=>{
    let customer_id = Request.query.customer_id;
    let sql = `SELECT customer_id ,real_name,mobile_1,mobile_2,festatus_id,machine_model,fe_model,DATE_FORMAT(last_time,'%Y-%m-%d') AS 'last_time',
    fe_periodicity - DATEDIFF(NOW(),last_time) AS "valid_time",customer_star,customer_area,address ,
    allot_status,labour_name ,machine_model ,machine_id,sale_id  from service where customer_id = ${customer_id} order by sale_id`;

    let resset = await mysql.query(sql);
    Response.send({
        code:200,
        festatus:resset
    })
    
})

//设置 festatus 最近更换时间
router.use('/finished',(Request,Response)=>{
    let fesid = Request.query.fesid;
    let finishTime = Request.query.finishtime;
    let addrecord = Request.query.addrecord;
    console.log("finish time:",Request.query);
    let sql = `select * from festatus where festatus_id = ${fesid}`;
    mysql.query(sql).then(resset=>{
        if(resset.length == 0){
            Response.send({
                code :403,
                msg:'没有找到这条记录'
            })
            return;
        }
        let allot_status = resset[0].allot_status;
        console.log('finished allot_status :',allot_status);
        if(addrecord){
            if(allot_status){
                let sql2 = `insert into maintain(maintain_time,maintain_status,labour_id,maintain_for,maintain_record) values(?,?,?,?,?)`;
                let par = [finishTime,1,allot_status,fesid,'手动设置'];
                mysql.insert(sql2,par).then(result =>{
                    Response.send({
                        code:200,
                        msg:'设置成功+'+finishTime
                    })
                })
            }else{
                let sql2 = `insert into maintain(maintain_time,maintain_status,labour_id,maintain_for,maintain_record) values(?,?,?,?,?)`;
                let par = [finishTime,1,null,fesid,'手动设置'];
                mysql.insert(sql2,par).then(result =>{
                    Response.send({
                        code:200,
                        msg:'设置成功+'+finishTime
                    })
                })
            }
        }else {
            let sql = `update festatus set last_time = '${finishTime}' where festatus_id = ${fesid}`;
            mysql.query(sql).then(result=>{
                Response.send({
                    code:200,
                    msg:'设置成功'
                })
            }).catch(error=>{
                console.log("set customer finish time error:",error,"\nsql:",sql);
                
                Response.send({
                    code:500,
                    msg:'设置失败，服务器错误'
                })
            })
            sql
        }
        
    })

   

})

module.exports=router;


