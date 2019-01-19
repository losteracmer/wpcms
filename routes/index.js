var express = require('express');
var router = express.Router();

const conn = require('../common/mysql');

let sql = 'select * from customer';


