const encode = require('./encode');
const random = require('./random');
const Base64 = require('./base64')
//1.生成8位的随机数
let randomWord = random(false,8);
let base64 = new Base64();
//2.对生成的随机数加密
let base64Random = base64.encode(randomWord);
function createncryptedPasswd(password){
    return encode(base64Random,password)
}

module.exports = createncryptedPasswd;