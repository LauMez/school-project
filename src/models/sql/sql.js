import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nombreBaseDatos'
}

const connection = await mysql.createConnection(config)

export class algunModelo {
    static async getAll({genre}) {
        const result = await connection.query(
            'SELECT * FROM Tabla'
        )
    }
}