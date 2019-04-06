var mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '445247721',
    port: '3306',
    database: 'wpcms',
    multipleStatements: true,
    charset:'utf8mb4_general_ci'
};
var machine_name2 = {
    "R-701":"R-701白"
}
var config = 
{
    //mysql的配置
    mysqlConfig:mysqlConfig,

    //app version
    lastVersion:2,

    //机器名称映射表
    machine_name2:machine_name2
}
module.exports = config;