const crypto = require('crypto')
const Base64 = require('./base64')

function encode(base64Random,password){
    //2.将第一步的结果与用户输入的密码拼接
    let newPas = base64Random + password;
    //3.将第二步的结果进行MD5加密
    let md5 = crypto.createHash("md5");
    let md5Pas = md5.update(newPas).digest("hex");
    //4.将第三步进行base64加密
    let base64 = new Base64();
    let base64Md5 = base64.encode(md5Pas);
    //5.将第一步与第四步拼接
    let lastPassword = base64Random + base64Md5;

    return lastPassword;
}

module.exports = encode;