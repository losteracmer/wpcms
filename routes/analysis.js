const express = require('express');
const events = require('events');
const router = express.Router();
const mysql = require('../common/mysql');

var EE = new events.EventEmitter();

var FES = [];
var ANA = [];
var count = 0;
EE.on('do', function (month, year, Response) {
    console.log(month, ' ', year);
    //console.log(ANA);
    let sql = `SELECT fe_id,maintain_time,fe_model,maintain_status FROM maintenance`
    mysql.query(sql).then(resset => {
        for (let fe of resset) {
            ANA.forEach(item => {
                if (fe.fe_id == item.id) {
                    let MMTime = new Date(fe.maintain_time);
                    let nowMonth = MMTime.getMonth() + 1;
                    let nowYear = MMTime.getFullYear()
                    //console.log(fe.fe_model," maintain : ",nowMonth,"year: ",nowYear);
                    if (nowYear == year)
                        item.data[nowMonth]++;
                }
            })
        }
        console.log(ANA);
        EE.emit('end', Response);
    })
})

EE.on('begin', function (year, Response) {
    let sql = `SELECT * from filterelement`;
    mysql.query(sql).then(resset => {
        for (let i = 0; i < resset.length; i++) {
            let item = resset[i];
            ANA.push({
                name: item.fe_model,
                id: item.fe_id,
                type: 'line',
                stack: 'Total',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            })
            FES.push(item.fe_model);
        }
        EE.emit('do', 1, year, Response);
    })
})
EE.on('end', function (Response) {
    Response.send({
        code: 200,
        series: ANA,
        legend: {
            data: FES
        }
    })
})
router.use('/getechat', (Request, Response) => {
    let year = Request.query.year;
    var FES = [];
    var ANA = [];
    //EE.emit('begin',year,Response);
    let sql = `SELECT * from filterelement`;
    mysql.query(sql).then(resset => {
        for (let i = 0; i < resset.length; i++) {
            let item = resset[i];
            ANA.push({
                name: item.fe_model,
                id: item.fe_id,
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                lineStyle: {
                    normal: {
                        width: 3,
                        shadowColor: 'rgba(0,0,0,0.1)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                markLine : {
                    data : [
                        {type : 'average', name: '均值'}
                    ]
                },
            })
            FES.push(item.fe_model);
        }
        //EE.emit('do',1,year,Response);
        let sql = `SELECT fe_id,maintain_time,fe_model,maintain_status FROM maintenance`
        mysql.query(sql).then(resset => {
            for (let fe of resset) {
                ANA.forEach(item => {
                    if (fe.fe_id == item.id) {
                        let MMTime = new Date(fe.maintain_time);
                        let nowMonth = MMTime.getMonth() + 1;
                        let nowYear = MMTime.getFullYear()
                        //console.log(fe.fe_model," maintain : ",nowMonth,"year: ",nowYear);
                        if (nowYear == year)
                            item.data[nowMonth]++;
                    }
                })
            }
            console.log(ANA);
            //EE.emit('end', Response);
            Response.send({
                code: 200,
                series: ANA,
                legend: {
                    data: FES
                }
            })
        })
    })
})

module.exports = router;