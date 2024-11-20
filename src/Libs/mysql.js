import mysql from 'serverless-mysql'

export const conexion = mysql({

    config:
    {
        host: 'localhost',
        user:  'root',
        password: '',
        port: 3306,
        database: 'Computadora'
    }

})