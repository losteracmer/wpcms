const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/getmachinelist",(Request,Response)=>{

    let sql = `select * from machine order by machine_id desc`;
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
                msg:'这个型号还没有滤芯',
                felist:resset
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

router.use('/getaddfelist',(Request,Response)=>{
    let machine_id= Request.query.machine_id;
    let sql = `select * from filterelement WHERE fe_id NOT IN (SELECT fe_id FROM machine2filterelement WHERE machine_id = ${machine_id})`;
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
    let fe_model = Request.query.fe_model;
    let fe_periodicity = Request.query.fe_periodicity*1;

    //先查找有没有这个

    let sql = `insert into filterelement(fe_model,fe_periodicity) values(?,?)`;
    let par = [fe_model,fe_periodicity];

    mysql.insert(sql,par).then(result=>{
        Response.send({
            code:200,
            msg:'添加滤芯成功'
        })
    }).catch(error=>{
        console.error('add fe error:',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
    
});



router.use('/addmachine',(Request,Response)=>{
    let machine_model = Request.query.machine_model;
    let machine_price = Request.query.machine_price*1;


    //先查找有没有这个

    let sql = `insert into machine(machine_model,machine_price,come_time) values(?,?,?)`;
    let par = [machine_model,machine_price,new Date()];

    mysql.insert(sql,par).then(result=>{
        Response.send({
            code:200,
            msg:'添加新机器成功'
        })
    }).catch(error=>{
        console.error('add machine error:',error);
        Response.send({
            code:500,
            msg:'服务器错误'
        })
    })
    
});

router.use('/addmachinefe',(Request,Response)=>{
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
router.use('/deletemachinefe',(Request,Response)=>{
    let machine_id = Request.query.machine_id;
    let fe_id = Request.query.fe_id;

    //先查找有没有这个

    let sql = `delete from machine2filterelement where machine_id =? and fe_id = ?`;
    let par = [machine_id,fe_id];

    mysql.insert(sql,par).then(result=>{
        Response.send({
            code:200,
            msg:'删除成功'
        })
    }).catch(error=>{
        console.error('delete machine fe error:',error);
        Response.send({
            code:500,
            msg:"删除失败"
        })
    })
    
});



module.exports = router;