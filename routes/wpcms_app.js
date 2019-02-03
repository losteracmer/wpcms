const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use('/login',require('./app/login'));

router.use('/change',require('./app/ChangeAvatarUrl'));

router.use("/get",require("./app/maintenance"));

router.use('/set',require('./app/finishmaintain'));

router.use('/update',require('./app/update'));
module.exports = router;