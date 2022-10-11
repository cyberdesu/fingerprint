/* eslint-disable linebreak-style */
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'be5dddd2b057a9',
  password: 'a8b7ee32',
  database: 'heroku_19be3f159ae3ff9',
});
connection.connect(function (err){
  if(err) throw err;
});

module.exports = connection;
