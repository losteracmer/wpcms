var express = require('express');
var router = express.Router();

const conn = require('../common/mysql');

let sql = 'select * from customer';


/* GET home page. */
module.exports = (app)=>{
  app.get('/',(req, res)=>{
    res.render('index',{title:'Express'});
  });
  app.get('/from',(req, res)=>{
    conn.query('select * from customer').then(rows=>{
        // for(let i = 0 ; i < rows.length; ++i){
        //   console.log(rows[i].real_name);
        // }
        res.render('from',{data:rows}); 
    }).catch(error =>{
      console.error(error);
    });
  });
};
