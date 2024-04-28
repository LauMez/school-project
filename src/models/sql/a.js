import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: '3600',
    password: '',
    database: 'nombre_database'
}

const connection = await mysql.createConnection(config)

//connection.query('SELECT * FROM ...')
