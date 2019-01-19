const random = require('./random')
const mysql = require('../common/mysql')
function creat(account){
    let code = random(false,16);

    let sql = `UPDATE admins SET temporarycode = ? WHERE account = ?`
    let par = [code,account]
    mysql.update(sql,par).then(result=>{
        console.log('更新临时码成功');
    }).catch(error=>{
        console.log('更新临时码失败',error)
    }) 
   return code;
}


function check(account ,code,cb){
    let sql = `SELECT * FROM admins WHERE account = '${account}' AND temporarycode = '${code}'`
    mysql.query(sql).then(resset=>{
        if(resset.length > 0) 
            cb(true);
        else
            cb(false);
    })
}

exports.creat = creat;

exports.check = check;