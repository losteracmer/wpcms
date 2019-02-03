const express = require('express');
const router = express.Router();
const mysql = require('../common/mysql');

router.use('/login',require('./app/login'));



module.exports = router;