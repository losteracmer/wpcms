const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use('/getlist', (Request, Response) => {

    let sql = `select * from labour`;

    mysql.query(sql).then(resset => {
        Response.send({
            code: 200,
            labourlist: resset
        })
    }).catch(error => {
        console.error('labour getlist错误', error);
        Response.send({
            code: 500,
            msg: '服务器错误'
        })
    })

});

router.use('/getdetail', (Request, Response) => {
    let labour_id = Request.query.labour_id;
    let sql = `select * from labour where labour_id = '${labour_id}'`;
    if (!labour_id) {
        console.log('跳转。。。');

        Response.send({
            code: 302,
            href: '/labour_list.html'
        })
    }
    mysql.query(sql).then(resset => {
        Response.send({
            code: 200,
            detail: resset[0]
        })
    }).catch(error => {
        console.error('labour getdetail错误', error);
        Response.send({
            code: 500,
            msg: '服务器错误'
        })
    })

});

router.use('/change', (Request, Response) => {
    let body = Request.body;
    //console.log(body);

    let labour_id = body.labour_id;
    let labour_pw = body.labour_pw;
    let labour_name = body.labour_name;
    let labour_authriory1 = body.labour_authriory1;
    let labour_authriory2 = body.labour_authriory2;
    let labour_authriory = 0;
    labour_authriory += labour_authriory1 == 'on' ? 1 : 0;
    labour_authriory += labour_authriory2 == 'on' ? 2 : 0;
    //console.log('权限:',labour_authriory);
    let sql = `update labour set labour_pw = ?,labour_name =?,labour_authriory = ? where labour_id = ?`;
    let par = [labour_pw, labour_name, labour_authriory, labour_id];
    mysql.update(sql, par).then(result => {
        Response.send({
            code: 200,
            msg: '修改成功'
        })
    }).catch(error => {
        console.log('change laobur error:', error);
        Response.send({
            code: 500,
            msg: '服务器错误'
        })
    })

});
router.use('/add', (Request, Response) => {
    let body = Request.body;
    console.log("body: ====  ", body);

    let labour_id = body.labour_id;
    let labour_pw = body.labour_pw;
    let labour_name = body.labour_name;
    let labour_authriory1 = body.labour_authriory1;
    let labour_authriory2 = body.labour_authriory2;
    let labour_authriory = 0;
    labour_authriory += labour_authriory1 == 'on' ? 1 : 0;
    labour_authriory += labour_authriory2 == 'on' ? 2 : 0;
    //console.log('权限:',labour_authriory);
    let sql = `insert into labour(labour_pw,labour_name,labour_authriory,labour_id) values(?,?,?,?)`;
    let par = [labour_pw, labour_name, labour_authriory, labour_id];
    mysql.insert(sql, par).then(result => {
        Response.send({
            code: 200,
            msg: '修改成功'
        })
    }).catch(error => {
        console.log('change laobur error:', error);
        Response.send({
            code: 500,
            msg: '服务器错误'
        })
    })

});

router.use('/delete', (Request, Response) => {
    let labour_id = Request.query.labour_id;

    let sql = `delete from labour where labour_id = '${labour_id}'`;
    mysql.query(sql).then(result => {
        Response.send({
            code: 200,
            msg: '删除员工成功'
        })
    }).catch(error => {
        console.log('delete labour error:', error);

        Response.send({
            code: 500,
            msg: '服务器错误,删除失败'
        })
    })
});

//获取员工的更换记录

router.use('/maintenance', (Request, Response) => {
    let labour_id = Request.query.labour_id;
    if (!labour_id) {
        Response.send({
            code: 403,
            msg: '缺少参数'
        })
        return;
    }
    let sql = `SELECT 
    machine_id,DATE_FORMAT(maintain_time,'%Y-%m-%d %H:%i') AS 'maintain_time',maintain_status,labour_id,labour_name ,
    festatus_id ,allot_status,customer_id,real_name,machine_code,maintain_record,address,
    machine_model ,labour_avatarUrl,fe_model,fe_id ,maintain_for ,sale_id from maintenance where labour_id = '${labour_id}' order by maintain_time desc`;

    mysql.query(sql).then(resset => {
        Response.send({
            code: 200,
            maintenance: resset
        })
    }).catch(error => {
        console.error('get maintenance error:', error);

        Response.send({
            code: 500,
            msg: '服务器错误'
        })
    })

})

router.use('/accmaintenance', (Request, Response) => {
    let labour_id = Request.query.labour_id;

    let sql = `select accessory_id,accessory_model,DATE_FORMAT(finish_time,'%Y-%m-%d %H:%i') AS 'finish_time',accmaintain_record,labour_name,sale_id,accessory_id ,accmaintain_status,accmaintain_id ,customer_id, address,real_name from accmaintenance where labour_id = '${labour_id}' order by finish_time desc`;
    mysql.query(sql).then(resset => {
        Response.send({
            code: 200,
            accmaintain: resset
        })
    }).catch(error => {
        console.error('get maintenance error:', error);

        Response.send({
            code: 500,
            msg: '服务器错误'
        })
    })
});
//setLabourStorage
router.use("/setLabourStorage", async (Request, Response) => {
    let labour_id = Request.query.labour_id;
    let fe_id = Request.query.fe_id;
    let number = Request.query.number;
    console.log("setLabourStorage: ", Request.query);

    let sql = `insert into labourstorage(labour_id,fe_id,quantity) values('${labour_id}',${fe_id},${number});`;
    let sqlSelect = `select * from labourstorage where labour_id = '${labour_id}' and fe_id = ${fe_id}`;

    try {
        let resset = await mysql.query(sqlSelect);
        if (resset.length != 0) {
            Response.send({
                code: 400,
                msg: "已经存在该值"
            })
            return ;
        }
        let result = await mysql.query(sql);
        Response.send({
            code: 200,
            msg:"添加成功"
        })
    } catch (e) {
        console.log("ERROR setLabourStorage",e)
        Response.send({
            code: 500,
            msg: "服务器错误"
        })
    }


});

//addstorage

router.use("/addstorage", async (Request, Response) => {
    let labour_id = Request.query.labour_id;
    let fe_id = Request.query.fe_id;
    let addNumber = Request.query.addNumber|0;
    let addRecord = Request.query.addRecord;
    //console.log("addstorage: ", Request.query);
    //整合消息
    let RecordStr = `change by admin record: ${addRecord}`
    let sqlInset = `insert into labourstoragechangelog(labour_id,fe_id,record_time,record_reason,change_sum) values(?,?,?,?,?);`;
    let par = [labour_id, fe_id, new Date(), RecordStr,addNumber];
    let sqlUpdate = `update labourstorage set quantity = quantity + ${addNumber} where labour_id = '${labour_id}' and fe_id = ${fe_id}`;

    try {
        let resset = await mysql.query(sqlUpdate);

        let result = await mysql.insert(sqlInset,par);
        Response.send({
            code: 200,
            msg:"更改成功"
        })
    } catch (e) {
        console.log("ERROR addstorage",e)
        Response.send({
            code: 500,
            msg: "服务器错误"
        })
    }


});

router.use("/storage", async (Request, Response) => {
    let labour_id = Request.query.labour_id;

    let sql = `select * from labourstorage ,filterelement where filterelement.fe_id = labourstorage.fe_id and labour_id = '${labour_id}' `;

    try {
        let resset = await mysql.query(sql);
        Response.send({
            code: 200,
            labourStorageList: resset
        })
    } catch (e) {
        console.log("ERROR storage",e)
        Response.send({
            code: 500,
            msg: "服务器错误"
        })
    }


});

router.use('/getnotstoragefelist',(Request,Response)=>{
    let labour_id = Request.query.labour_id;
    let sql = `select * from filterelement where fe_id not in (select fe_id from labourstorage where labour_id = '${labour_id}')`;
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

module.exports = router;


