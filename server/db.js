const mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
    connectionLimit: 10,
    user:'Harsh',
    password: "",
    host: 'localhost',
    port: 3306,
    database: 'todoapp'
})

pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database!');
      connection.release();
    }
  });

module.exports = pool;