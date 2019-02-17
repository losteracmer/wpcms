function add(x,y){ return new Promise((resolve,reject)=>{
    resolve(x+y)
  })}
  console.log(add(1,2).then(s =>{console.log(s); return new Promise()}));