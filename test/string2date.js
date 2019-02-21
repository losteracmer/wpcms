let str = '2028-1-1';
let date = new Date(str);
console.log(str);
console.log(date.getDay());
console.log(date.getTime() < new Date().getTime());

console.log(new Date('2018-1-1')>new Date('2019-1-1'))