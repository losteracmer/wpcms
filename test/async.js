var Delay_Time = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve("完成啦")
        }, ms);
    })
}
// async 函数
var Delay_Print = async function (ms) {
    let msg = await Delay_Time(ms)
    console.log(msg);
    return new Promise(function (resolve, reject) {
        reject("End");
    })
}

// 执行async函数后
Delay_Print(1000).then(function (resolve) {
    console.log(resolve);
})

console.log("begin")


function do1() {
    console.log("do1")
}
async function do2() {
    console.log("do2")
}

function add(x, y) {
    return new Promise((resolve, reject) => {
        resolve(x + y)
    })
}
console.log(add(1, 2).then(s => {
    console.log(s);
    return new Promise()
}));
do2();
do1();