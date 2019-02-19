/*
    解析 自动添加数据
*/
const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');
const machine_name2 = require("../config").machine_name2;
let titleStr = "序号	星级	来源	区域	地址	姓名	电话2	电话	条码	型号	安装日期	最近更换	PP棉	最近更换	颗粒	最近更换	后置	最近更换	压缩	最近更换	超滤膜	最近更换	RO模";
let valueStr = "78	1	店面	黄金小区		刘坤		13598363333		RO-185E	2015-4-3	2018-6-6	-77	2018-6-6	108	2015-4-3	-1052	2017-6-20	-63	2015-4-3	-687	2015-4-3	-322"
let pp = "店面	胜天家园15#1单元	李佳赛		15678795215		608818091630676	RL-501B	2018-12-1						";
let titlePP = "类别	地址	姓名	电话1	电话1	电话2	条码	型号	安装日期	PP棉	颗粒	后置	压缩	UF	RO";

function split(splitstr) {
    let strArr = splitstr.split("\t");

    console.log(strArr)
}

function format(timeStr) {
    if (timeStr.length == 0) return undefined;
    let timeArr = timeStr.split("-");
    if (timeArr[1].length == 1) {
        timeArr[1] = "0" + timeArr[1];
    }
    if (timeArr[2].length == 1) {
        timeArr[2] = "0" + timeArr[2];
    }
    return timeArr[0] + "-" + timeArr[1] + "-" + timeArr[2];
}
async function getMap(titleStr, valueStr) {
    let titleArr = titleStr.split("\t");
    let valueArr = valueStr.split("\t");
    if (titleArr.length != valueArr.length) {
        return null;
    }
    let aMap = new Map();
    for (let i = 0; i < titleArr.length; i++) {
        //console.log(titleArr[i]," | ",valueArr[i]);
        if (titleArr[i] == "星级") {
            let star = valueArr[i] == "" ? "1" : valueArr[i];
            aMap.set("customer_star", star);
        } else if (titleArr[i] == "来源" || titleArr[i] == "类别") {
            aMap.set("customer_from", valueArr[i]);
        } else if (titleArr[i] == "区域") {
            aMap.set("customer_area", valueArr[i]);
        } else if (titleArr[i] == "地址") {
            aMap.set("address", valueArr[i]);
        } else if (titleArr[i] == "电话" || titleArr[i] == "电话1") {
            aMap.set("mobile_1", valueArr[i]);
        } else if (titleArr[i] == "电话2") {
            aMap.set("mobile_2", valueArr[i]);
        } else if (titleArr[i] == "姓名") {
            aMap.set("real_name", valueArr[i]);
        } else if (titleArr[i] == "条码") {
            aMap.set("machine_code", valueArr[i]);
        } else if (titleArr[i] == "型号") {
            //需要在这里进行设置  某些机器可能和数据库中的不一致
            if (machine_name2.hasOwnProperty(valueArr[i])) {
                aMap.set("machine_model", machine_name2[valueArr[i]])
            } else {
                aMap.set("machine_model", valueArr[i]);
            }
        } else if (titleArr[i] == "安装日期") {
            aMap.set("sale_time", format(valueArr[i]));
        } else if (titleArr[i] == "最近更换") {
            //在这里要判断他的下一位 才是滤芯型号
            if (titleArr[i + 1] == "PP棉") {
                aMap.set("PP棉", format(valueArr[i]));
            } else if (titleArr[i + 1] == "颗粒" || titleArr[i + 1] == "颗粒碳") {
                aMap.set("颗粒碳", format(valueArr[i]))
            } else if (titleArr[i + 1] == "后置" || titleArr[i + 1] == "后置碳") {
                aMap.set("后置碳", format(valueArr[i]))
            } else if (titleArr[i + 1] == "压缩") {
                aMap.set("碳棒", format(valueArr[i]))
            } else if (titleArr[i + 1] == "超滤膜" || titleArr[i + 1] == "超滤") {
                aMap.set("超滤膜", format(valueArr[i]))
            } else if (titleArr[i + 1] == "RO膜" || titleArr[i + 1] == "RO" || titleArr[i + 1] == "ro膜" || titleArr[i + 1] == "RO模") {
                aMap.set("RO膜", format(valueArr[i]))
            }
        }
    }

    return aMap;

}

async function parseCustomer() {
    console.log("开始...");

    let feMap = await getMap(titleStr, valueStr);
    console.log("feMap:\n", feMap);
    console.log("结束...");

}

//parseCustomer();
//接受发来的title value 准备解析
router.use('/parsemsg', async (Request, Response) => {
    /**
     * 0.信息处理
     *      （1 日期信息 。。。
     * 0.5 客户信息处理
     *      （1 通过姓名，电话，判断数据库中是否存在
     *              《1 存在 标记 发回前台判断 下一步
     *              《2 不存在 标记不存在 下一步
     *      （2 通过title 将客户信息解析 保存 
     * 
     * 1.找到机器型号
     *      （1 找到 下一步
     *      （2 找不到 给前台发代码确定机器型号 600
     * 2.搜索机器型号对应的滤芯
     * 3.在给出的 title 和 value 中获取 映射关系  机器滤芯 -> value
     *      如果获取不到值 ，将安装日期作为最近更换时间
     * 4.生成滤芯form数组 ，机器型号 ， 安装日期 ， 客户信息  表 发给前台 ，等待确定处理
     */
    let titleStr = Request.query.titleStr;
    let valueStr = Request.query.valueStr;

    //可选择传值
    let machine_id = Request.query.machine_id;
    let machine_model = Request.query.machine_model;
    let sale_time = Request.query.sale_time;

    let feList = null;
    let machine_obj = null;
    let fe_last_time = []; //记录每个滤芯最近更换时间的
    let aMap = await getMap(titleStr, valueStr);
    if (aMap == null) {
        Response.send({
            code: 403,
            msg: "缺少参数,或者传入的键值不匹配"
        })
        return;
    }
    if (sale_time) {
        console.log("主动发来sale_time");

        //如果传来了sale_time 直接用
        aMap.set("sale_time", sale_time);
    }

    try {
        //如果前台发来机器型号，则在这里直接用
        if (machine_id) {
            //如果前台传了id  找到这个型号
            console.log("主动发来machine_id");
            machine_obj = await mysql.query(`select * from machine where machine_id = ${machine_id}`)
            aMap.set("machine_model", machine_obj[0].machine_model);
            aMap.set("machine_id", machine_obj[0].machine_id);
        } else if (machine_model) {
            console.log("主动发来machine_model");
            //如果传了机器型号 ...
            machine_obj = await mysql.query(`select * from machine where machine_model = '${machine_model}'`);
        } else {
            //如果什么都没有
            machine_obj = await mysql.query(`select * from machine where machine_model = '${aMap.get("machine_model")}'`);

        }
        console.log("machine_obj :", machine_obj);

        if (machine_obj.length == 0) {
            //没有找到这个型号的机型 ，发给前台判断
            Response.send({
                code: 405,
                msg: `没有找到${aMap.get("machine_model")},请手动选择机器型号`
            })
        }
        if (aMap.get("sale_time") == undefined) {
            //没有找打安装日期
            Response.send({
                code: 406,
                msg: "没有找到安装日期，请手动输入"
            })
        } else {
            //保存machine_id
            aMap.set("machine_id", machine_obj[0].machine_id);
            feList = await mysql.query(`select * from machine2filterelement as m2f,filterelement as fe where m2f.machine_id = ${machine_obj[0].machine_id} and fe.fe_id = m2f.fe_id`)
            //console.log("feList: ", feList);

            //查询完felist 后，遍历 它
            for (let i = 0; i < feList.length; i++) {
                let fe_model = feList[i].fe_model;
                if (aMap.get(fe_model) != undefined) {
                    fe_last_time.push({
                        fe_model: fe_model,
                        fe_id: feList[i].fe_id,
                        last_time: aMap.get(fe_model)
                    })
                } else {
                    //没有的话，就直接那销售日期来算
                    fe_last_time.push({
                        fe_model: fe_model,
                        fe_id: feList[i].fe_id,
                        last_time: aMap.get("sale_time")
                    })
                }
            }
            Response.send({
                code: 200,
                msg: '请确认',
                fe_last_time,
                real_name: aMap.get("real_name") || "",
                customer_star: aMap.get("customer_star") || "",
                customer_from: aMap.get("customer_from") || "",
                customer_area: aMap.get("customer_area") || "",
                address: aMap.get("address") || "",
                mobile_1: aMap.get("mobile_1") || "",
                mobile_2: aMap.get("mobile_2") || "",
                machine_code: aMap.get("machine_code") || "",
                sale_time: aMap.get("sale_time"),
                machine_model: aMap.get("machine_model"),
                machine_id: aMap.get("machine_id")
            })
        }
    } catch (error) {
        Response.send({
            code: 500,
            msg: "服务器发生错误,刷新重试..."
        })
    }


})
//最后记得try包裹

router.use("/submit",async (Request,Response)=>{
    let body = Request.body;
    console.log("body: ",body);
    try {
        //增加new 客户
        let real_name = body.real_name;
        let mobile_1 = body.mobile_1;
        let mobile_2 = body.mobile_2;
        let customer_area = body.customer_area;
        let address = body.address;
        let remark = body.remark;
        let customer_from = body.customer_from;
        let customer_star = body.customer_star;

        let customer_id = (new Date()).getTime();
        let sql = `insert into customer(customer_id,real_name , mobile_1 ,mobile_2 ,customer_area,address ,customer_from ,customer_star,remark,create_time)  values(?,?,?,?,?,?,?,?,?,?) `;
        let par = [customer_id,real_name,mobile_1,mobile_2,customer_area,address,customer_from,customer_star,remark,new Date()];
        let result = await mysql.insert(sql,par);
        console.log("插入new customer 影响行数结果：",result.affectedRows)


        //找到机器
        let machine_id = body.machine_id;
        let machine_code = body.machine_code;
        let machine_model = body.machine_model;
        //创建 非auto 订单
        let sale_time = body.sale_time;
        let timeCode = (new Date()).getTime();
        let sale_id = timeCode;
        let sql2 = `insert into sales(sale_id,customer_id,machine_id,machine_code,sale_time,insert_festatus) values(?,?,?,?,?,?)`;
        let par2 = [timeCode,customer_id,machine_id, machine_code,sale_time,0];

        let result2 = await mysql.insert(sql2,par2);

        feList = await mysql.query(`select * from machine2filterelement as m2f,filterelement as fe where m2f.machine_id = ${machine_id} and fe.fe_id = m2f.fe_id`)
        for(let i = 0;i<feList.length;i++){
            let fe_id = feList[i].fe_id;
            
                //如果找到这条，就插入？
                //不找了，因为肯定有
                let sql3 = `insert into festatus(fe_id,sale_id,last_time) values(?,?,?)`;
                let par3 = [fe_id,sale_id,body[fe_id]];
                let result = await mysql.insert(sql3,par3);
            
        }
        Response.send({
            code:200,
            msg:`插入成功`+`\n ${real_name} 在 ${sale_time} 安装 机器【${machine_model}】\n 如果有误，请删除刚刚创建的客户即可`
        })
    } catch (error) {
        console.log("parse submit error:",error)
        Response.send({
            code:500,
            msg:"服务器错误，请刷新后重试"
        })
    }
})
module.exports = router;