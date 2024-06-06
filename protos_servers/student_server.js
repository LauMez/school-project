import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import mysql from 'mysql2'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentDB'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const packageDefinition = protoLoader.loadSync('../protos/student.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const studentservice = grpc.loadPackageDefinition(packageDefinition).studentservice;

const server = new grpc.Server();
const db = mysql.createConnection(connectionString)

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});
server.addService(studentservice.StudentService.service, {
  GetAll:(call, callback) => {
    db.query('SELECT * FROM Personal_Information', (err, rows) => {
      if(err) callback({ code: grpc.status.INTERNAL, details: "Internal error" });
      for(const data of rows) {
        call.write(data)
      }
      call.end()
    })
  },
  GetByID: (call, callback) => {
    const { CUIL } = call.request;
    db.query('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL], (err, row) => {
      if (err) {
        callback({ code: grpc.status.INTERNAL, details: "Internal error" });
      } else if (row) {
        callback(null, { CUIL: row[0].CUIL, first_name: row[0].first_name, second_name: row[0].second_name, last_name1: row[0].last_name1, last_name2: row[0].last_name2, phone_number: row[0].phone_number, direction: row[0].direction});
      } else {
        callback({ code: grpc.status.NOT_FOUND, details: "Student not found" });
      }
    });
  }
});

const port = '50052';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});