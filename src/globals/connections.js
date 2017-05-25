'use strict';
const mysql = require('mysql');

exports.db_single = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'freight'
});

exports.db_multi = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'freight',
  multipleStatements: true
});
