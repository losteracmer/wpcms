# wpcms
净水机客户管理系统
wpc

首页的 完成，没有刷新表格  

数据库，工人删除后，fesstaus设为null

滤芯更换记录（总）list
配件维修list
配件设置页


用户详情页
        增加购买订单
        配件维修选项

更换配件  
        在用户那个页面，增加一个配件时间线，
        是否要派工？
        增加设置customer_detail 设置派工，手动完成派工


dosomething ？


客户 僵尸  回复

增加  最近更换时间

机器型号删除

用户详情 +  滤芯更换时间

！imortant  订单创建时，用户以更换滤芯无法

online 
更改了触发器 设置auto_insert_festatus 选项 可以不自动添加    

local : 
更改 service 的视图  增加machine_code 
修改 maintenance 视图  labour right join maintain on labour_id&&  (对于没有员工的维修记录)

圆角列表、图文列表 不要图

####更新 2019-4-6
         完善app  version 2
         对新模式重构app
         完成app后台接口
         
添加表
```sql
CREATE TABLE `wpcms`.`Untitled`  (
  `customer_maintain_id` int(32) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(64) NOT NULL,
  `labour_id` varchar(32) NOT NULL,
  `record` varchar(255) NULL,
  `maintain_time` datetime NOT NULL,
  PRIMARY KEY (`customer_maintain_id`),
  CONSTRAINT `customer_maintain_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `wpcms`.`customer` (`customer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `customer_maintain_labour_id_fk` FOREIGN KEY (`labour_id`) REFERENCES `wpcms`.`labour` (`labour_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

```

页面  每次 加载数据过多，没有交互信息显示
datatables  设置无内容字段