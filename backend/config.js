const mysql = require('mysql');

exports.connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'adminP7',
  password : '1234',
  database : 'bddp7'
});