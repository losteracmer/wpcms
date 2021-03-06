var mysql = require('mysql');
var mysqlp = require('promise-mysql');
var mysqlConfig = require('../config.js').mysqlConfig;

var pool = mysql.createPool(mysqlConfig);

var pp = mysqlp.createPool(mysqlConfig);

exports.connectionp = async function () {
    return await pp.getConnection();
}

exports.connection = function(){
    return new Promise(function (resolve,reject) {
        pool.getConnection((err,connection) =>{
            if (err) {
                reject(err);
            }else {
                resolve(connection);

            }
        })
    })
}


//查询语句
exports.query = function(sql) {
    return new Promise(function(resolve, reject) {
        //创建连接池
        pool.getConnection(function(err, connection) {
            if(err){
                console.log('连接池错误',err)
                return;
            }
            connection.query(sql, function(err, result) {
                if (result) {
                    resolve(result);
                } else {
                    reject(err);
                }
                // 释放连接  
                connection.release();
            });
            
        });
    })
}
//更新
exports.update = function(sql,par) {
    return new Promise(function(resolve, reject) {

        pool.getConnection(function(err, connection) {

            connection.query(sql, par,function(err, result) {
                if (result) {
                    resolve(result);
                } else {
                    reject(err);
                }
                // 释放连接  
                connection.release();
            });
            
        });
    })
}

//插入
exports.insert = function(sql,par) {
    return new Promise(function(resolve, reject) {

        pool.getConnection(function(err, connection) {

            connection.query(sql, par,function(err, result) {
                if (result) {
                    resolve(result);
                } else {
                    reject(err);
                }
                // 释放连接  
                connection.release();
            });
            
        });
    })
}

exports.end = function(){
    pool.end();
}