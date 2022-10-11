/* eslint-disable linebreak-style */
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'absensi',
  multipleStatements: true
});
connection.connect(function (err){
  if(err) throw err;
});

module.exports = connection;
