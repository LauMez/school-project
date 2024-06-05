import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import mysql from 'mysql2'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'subjectDB'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const packageDefinition = protoLoader.loadSync('../protos/subject.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const subjectservice = grpc.loadPackageDefinition(packageDefinition).subjectservice;

const server = new grpc.Server();
const db = mysql.createConnection(connectionString)

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});
server.addService(subjectservice.SubjectService.service, {
    GetAll: (call, callback) => {
        db.query('SELECT subjectID, name FROM Subject', async (err, subjects) => {
            if (err) callback({ code: grpc.status.INTERNAL, details: "Internal error" });

            try {
                const promises = subjects.map(async (subject) => {
                    const [subjectSchedule] = await db.promise().execute('SELECT day, schedule FROM Subject_Schedule WHERE subjectID = ?', [subject.subjectID]);
                    return {
                        name: subject.name,
                        day: subjectSchedule[0].day,
                        schedule: subjectSchedule[0].schedule
                    };
                });
    
                const subjectObjects = await Promise.all(promises);
                subjectObjects.forEach(subjectObject => call.write(subjectObject));
                call.end();
            } catch (error) {
                console.error('Error processing subjects:', error);
                callback({ code: grpc.status.INTERNAL, details: "Internal error" });
            }
        })
    },   
    GetByID: (call, callback) => {
        const { subjectID } = call.request;
        db.query('SELECT name FROM Subject WHERE subjectID = ?', [subjectID], (err, subject) => {
        if (err) callback({ code: grpc.status.INTERNAL, details: "Internal error" });

            const name = subject[0].name

            db.query('SELECT day, schedule FROM Subject_Schedule WHERE subjectID = ?', [subjectID], (err, subjectSchedule) => {
                if (err) callback({ code: grpc.status.INTERNAL, details: "Internal error" });

                const day = subjectSchedule[0].day
                const schedule = subjectSchedule[0].schedule

                callback(null, { name: name, day: day, schedule: schedule })
            })
        });
    }
});

const port = '50051';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});