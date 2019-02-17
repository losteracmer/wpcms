const mysql = require("../common/mysql")
const fs = require('fs')

function fetch(cb){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            try{
                //resolve(cb);
                cb();
            }catch(error){
                reject(error,"失败")
            }
        },500);
    })
    
}

// fetch(()=>{
//     console.log("1s 后....");
//     throw new Error("未知错误")
// }).then(function(){
//     console.log("成功执行");
    

// },function(reason,error){
//     console.log("执行失败",reason,error)
//     throw new Error("ERROR")
// }).catch((reason,error)=>{
//     console.log("catch: ",reason)
// })

function do1(){
    return new Promise((res,rej)=>{
        setTimeout(() => {
            rej("等待1s")
            console.log("--等待1s");
        }, 1000);
    })
    
}
function do2(){
    // return new Promise((res,rej)=>{
    //     setTimeout(() => {
    //         res("等待0.8s");
    //         console.log("--等待0.8s");
    //     }, 800);
        
    // })
    return Promise.reject("手动创建 reject");
    
}

// Promise.all([do1(),do2()]).then(resultArr =>{
//     console.log(resultArr[0]);
//     console.log(resultArr[1])
// })

//当任何一个resolved 或者reject 完成时触发then方法
Promise.race([do1(),do2()]).then(result=>{
    console.log(result);
}).catch(error=>{
    console.log('捕捉到了错误',error)
})
