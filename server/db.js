import mysql from "mysql2";


export const pool = mysql.createConnection({
    host: '',
    port:'3306',
    user: '',
    password: '',
    database: ''
  });
