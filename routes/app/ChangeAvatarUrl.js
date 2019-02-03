var express = require('express');
var mysql = require("../../common/mysql");
var router = express.Router()
var formidable = require('formidable')



router.use('/avatar',(req,res) =>{
    var formParse=new formidable.IncomingForm();
    formParse.uploadDir='./public/img';//缓存地址
    formParse.multiples=true;//设置为多文件上传
    formParse.keepExtensions=true;//是否包含文件后缀
    var uploadfiles=[];
    //文件都将保存在files数组中
    formParse.on('file', function (filed,file) {
        //console.log('frie文件:',filed,file);
        uploadfiles.push("/"+file.path.replace(/\\/g,'/'));
    })
    formParse.parse(req,function(error,fields,files) {
        console.log('avatar file list',uploadfiles);
        if (error) {
            console.log("error" + error.message);
            res.send({
                code:500,
                msg:'服务器错误'
            })
            return;
        }
        let avatarUrl = uploadfiles[0];
        let labour_id = fields.labour_id;
        let sql = `UPDATE labour SET labour_avatarurl = ? WHERE labour_id = ?`
        let par = [avatarUrl.substr(7),labour_id];
        mysql.update(sql,par).then(result =>{
            console.log("插入结果:",result);
            res.send({
                code:200,
                msg:'更换头像成功'
            })
        }).catch(error =>{
            res.send({
                code:500,
                msg:'服务器错误'
            })
        })

        
    
    });

});


module.exports = router;