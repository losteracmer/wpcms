const mysql = require("../common/mysql")

/**
 * 在正常的情况下，await后是一个Promise对象。如果不是就会立马转换成一个立即resolve的Promise对象。
 */
async function d(){
    let resset = await mysql.query("select * from admins;select * from admins")
    console.log(resset)
    let result = await 1+1;
    console.log(result)
    mysql.end();
}
d()
