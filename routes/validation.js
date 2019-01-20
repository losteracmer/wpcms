var express = require('express');
var router = express.Router();
const temporarycode = require('../utils/temporarycode');
router.use((Request,Response,Next)=>{
    console.log("url:",Request.url," cookies",Request.cookies);
    var url = Request.url;
    if(url.startsWith("/assets")||url.startsWith("/dist")||url.startsWith("/img")||url.startsWith("/src")||url == '/admin_login.html'||url=='/login'){
        Next();
        
        return;
    }else{
        if(!Request.cookies){
            Response.redirect('/admin_login.html');
            console.log('未登录');
            return;
        }
        if(!Request.cookies.login_status||!Request.cookies.admin){
            Response.redirect('/admin_login.html');
            console.log('未登录');
            return;
        }else{
            
            console.log("以登录..");
            
            temporarycode.check(Request.cookies.admin,Request.cookies.login_status,(flag)=>{
                if(flag){
                    console.log('身份验证成功..');
                    Next();
                    return;
                }else {
                    console.log("身份验证失败",Request.cookies.admin,Request.cookies.login_status);
                    
                    Response.redirect('/admin_login.html');
                }
            })
            
        }
    }
    
})

module.exports = router;


