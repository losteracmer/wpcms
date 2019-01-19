var express = require('express');
var router = express.Router();
var createCryptedPassword = require('../utils/createncryptedPasswd');
const encode = require('../utils/encode');
const mysql = require('../common/mysql');
const temporarycode = require('../utils/temporarycode');
router.use("/", (Request, Response) => {
    console.log('adminLogin:', Request.query)
    let account = Request.body.account;
    let password = Request.body.password;
    //403, 数据错误
    if (!account || !password) {
        Response.send({
            code: 403,
            msg: "请输入用户名与密码"
        });
        return false;
    }
    let sql = `SELECT * FROM admins WHERE account = '${account}'`;
    mysql.query(sql).then(resset => {
        if (resset.length > 0) {
            console.log(resset[0].password);
            //1.获取到的密码截取前面随机数通过base64加密的结果
            let base64Random = resset[0].password.substring(0, 12);
            let lastPassword = encode(base64Random, password);
            if (resset[0].password === lastPassword) {
                let key = temporarycode.creat(account);
                //登录成功后，生成key返回给前台，并且每次都以key和account作为凭证进行操作
                Response.cookie('login_status',key,{ expires: new Date(Date.now() + 100000000)});
                Response.cookie('admin',account,{ expires: new Date(Date.now() + 100000000)});
                Response.send({
                    code: 200,
                    msg: "登录成功",
                });
            } else {
                Response.send({
                    code: 403,
                    msg: "密码错误"
                });
            }
        } else{
            Response.send({
                code:403,
                msg:"账号错误，请核对"
            })
        }
    }).catch(error => {
        //404 数据库错误
        console.log('登录异常', error)
        Response.send({
            code: 500,
            msg: "程序员删库跑路了。。。"
        });
    })
})


module.exports=router;