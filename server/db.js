import mysql from "mysql2";


export const pool = mysql.createConnection({
    host: '127.0.0.1',
    port:'3306',
    user: 'Rokilo',
    password: 'Enriquenercasseau2300',
    database: 'familias_power'
  });