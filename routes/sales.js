/*
    订单的控制
    每增加一个订单，要在festatus表中存一个机器对应的所有滤芯
*/
const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use("/get",(Request,Response)=>{

})

router.use("/getlist",(Request,Response)=>{


})


router.use("/update",(Request,Response)=>{
    
})

router.use("/add",(Request,Response)=>{
    var tigger = `
    DROP TRIGGER auto_update_festatsu;

    CREATE DEFINER = \`root\`@\`localhost\` TRIGGER \`auto_update_festatsu\` AFTER INSERT ON \`sales\` FOR EACH ROW BEGIN
    BEGIN
    DECLARE Done int DEFAULT 0;
    DECLARE var_sale_time datetime DEFAULT NEW.sale_time;
    DECLARE var_machine_id INT(32) DEFAULT NEW.machine_id;
    
    DECLARE var_sale_id INT(32) DEFAULT NEW.sale_id;
    
    DECLARE var_fe_periodicity INT(32);
    DECLARE var_fe_id INT(32);
    --
    DECLARE msg CURSOR FOR SELECT filterelement.fe_id,fe_periodicity FROM filterelement,machine2filterelement WHERE machine2filterelement.machine_id=var_machine_id AND filterelement.fe_id = machine2filterelement.fe_id;
    DECLARE CONTINUE HANDLER FOR not found SET Done = 1;
    
    OPEN msg;
    flag_while:WHILE Done=0 do
    FETCH msg INTO var_fe_id,var_fe_periodicity;
    IF Done=1 THEN LEAVE flag_while; END IF;
    INSERT INTO festatus(sale_id,fe_id,last_time) VALUES(var_sale_id,var_fe_id,DATE_ADD(var_sale_time,interval var_fe_periodicity day));
    END WHILE flag_while;
    CLOSE msg;
    END
    `
    
})

router.use("/delete",(Request,Response)=>{
    
})


module.exports = router;