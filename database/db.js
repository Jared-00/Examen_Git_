const mysql = require('mysql');

const conexion = mysql.createConnection({
     host: 'localhost',
     user:'root',
     password:'itsh2023',
     database: 'sombrereria'
})

conexion.connect((error)=>{
    if(error){
         console.error('el error de conexion es:' +error);
         return;
    }
    console.log('CONECTADO A LA BASE DE DATOS EN MYSQL!');
})

module.exports = conexion;