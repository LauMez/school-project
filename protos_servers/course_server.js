import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import mysql from 'mysql2'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'courseDB'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const packageDefinition = protoLoader.loadSync('../protos/course.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const courseservice = grpc.loadPackageDefinition(packageDefinition).courseservice;

const server = new grpc.Server();
const db = mysql.createConnection(connectionString)

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

server.addService(courseservice.CourseService.service, {
    GetCourse: (call, callback) => {
        const { CUIL } = call.request;
        
        db.query('SELECT courseID, groupCourse FROM Inscription WHERE CUIL = ?', [CUIL], (err, course) => {
            if (err) {
                callback({ code: grpc.status.INTERNAL, details: "Internal error" });
            }
            const group = course[0].groupCourse
            const courseID = course[0].courseID

            db.query('SELECT year, division FROM Course WHERE courseID = ?', [courseID], (err, thisCourse) => {
                if (err) {
                    callback({ code: grpc.status.INTERNAL, details: "Internal error" });
                }  
                const year = thisCourse[0].year
                const division = thisCourse[0].division

                callback(null, { year: year, division: division, group: group })
            })
        })
    }
});

const port = '50051';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});