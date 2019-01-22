const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/getmachinelist",(Request,Response)=>{

    let sql = `select * from machine `;
    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            machinelist:resset
        })
    }).catch(error=>{
        console.error('get machine list error',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })

})

router.use('/getmachinefe',(Request,Response)=>{
    let machine_id = Request.query.machine_id;

    let sql = `select * from machine2filterelement ,filterelement where filterelement.fe_id = machine2filterelement.fe_id and machine_id = ${machine_id}`;
    mysql.query(sql).then(resset=>{
        if(resset.length == 0){
            Response.send({
                code:403,
                msg:'没有找到这个机器型号'
            })
        }else{
            Response.send({
                code:200,
                felist:resset
            })
        }
    }).catch(error=>{
        console.error('get machine fe list error :',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})

router.use('/getfelist',(Request,Response)=>{
    let sql = `select * from filterelement `;
    mysql.query(sql).then(resset=>{
        Response.send({
            code:200,
            felist:resset
        })
    }).catch(error=>{
        console.error('get machine list error',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
})

router.use('/addfe',(Request,Response)=>{
    let machine_id = Request.query.machine_id;
    let fe_id = Request.query.fe_id;

    //先查找有没有这个

    let sql = `insert into machine2filterelement values(?,?)`;
    let par = [machine_id,fe_id];

    mysql.insert(sql,par).then(result=>{
        Response.send({
            code:200,
            msg:'插入成功'
        })
    }).catch(error=>{
        console.error('add fe error:',error);
        Response.send({
            code:500,
            msg:'该机器已经存在此滤芯'
        })
    })
    
});




module.exports = router;