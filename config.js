var mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '445247721',
    port: '3306',
    database: 'wpcms',
    multipleStatements: true,
    charset:'utf8mb4_general_ci'
};

var config = 
{
    //mysql的配置
    mysqlConfig:mysqlConfig,

    //app version
    lastVersion:1
}
module.exports = config;