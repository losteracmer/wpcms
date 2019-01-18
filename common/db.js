var mysql = require('mysql');
var dbconfig = {
    host:'localhost',
    user:'root',
    prot:3306,
    password:'123',
    database:'test'
};

var pool = mysql.createPool(dbconfig);

exports.query = (sql,cb) => {
    pool.getConnection((err,connection)=>{
        connection.query(sql,(err,rows)=>{
            cb(rows);
            connection.release();
        })
    })
}