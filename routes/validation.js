var express = require('express');
var router = express.Router();
const temporarycode = require('../utils/temporarycode');
router.use((Request,Response,Next)=>{
    console.log(Request.url);
    if(Request.url == '/admin_login.html'){
        Next();
        return;
    }
    if(!Request.cookies){
        Response.redirect('/admin_login.html');
        console.log('未登录');
    }
    if(!Request.cookies.login_status||!Request.cookies.admin){
        Response.redirect('/admin_login.html');
        console.log('未登录');
        
    }else{
        
        console.log("以登录..");
        
        temporarycode(Request.cookies.login_status,Request.cookies.admin,(flag)=>{
            if(flag){
                console.log('身份验证成功..');
                Next();
            }else {
                Response.redirect('/admin_login.html');
            }
        })
        
    }
})

module.exports = router;