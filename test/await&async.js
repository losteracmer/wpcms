var delay_time = function(ms, param) {
    console.log("delay:",ms);
    
    return new Promise(function(resolve) {
        setTimeout(function() {
            console.log(new Date().getTime());
            resolve(param);
        }, ms)
    } )
}
var asyn_fun = async function (params) {
    console.log("params: ",typeof params,params)
    var time_out = 1000;
    const results =  params.map( param => {
      time_out = time_out + 100;
      var out =   delay_time(time_out, param);  //这里的await 是什么用
      return out
    });
    console.log("results: ",typeof results,results)
    var target = [];
    for(var ret of results) {
         target.push(await ret);  // await;
    }
    return  target; // 这里的await  ？
};
asyn_fun(['First','Second','Third','Last']).then(function(result){
    console.log(JSON.stringify(result),typeof result)  // ["First","Second","Third","Last"]
});
/**
 * 虽然map方法的参数是async函数，但它是并发执行的，因为只有async函数内部是继发执行，外部不受影响。
 * 后面的for..of循环内部使用了await，因此实现了按顺序输出。
 */

 /**
  * 总结
  * 1 async  加上这个修饰符的函数，会返回一个Promise的resolve 其中的参数是return 后面的返回值
  * 2 await 必须在async中使用 等待Promise 对象 的resolve 中的参数作为结果 ；如果await 后面跟的不是Promise ，会立马转换成一个立即resolve的Promise对象。
  */