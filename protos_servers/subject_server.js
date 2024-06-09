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
    GetAll: async(call, callback) => {
      try{
        const subjects = await new Promise((resolve, reject) => {
          db.query('SELECT subjectID, name FROM Subject', (err, subjects) => {
            if (err) reject(err);
            resolve(subjects);
          })
        })

        const subjectPromises = subjects.map(async (subject) => {
          const schedules = await new Promise((resolve, reject) => {
            db.query('SELECT day, schedule FROM Subject_Schedule WHERE subjectID = ?', [subject.subjectID], (err, schedules) => {
              if(err) reject(err)
              resolve(schedules)
            })
          })

          return schedules.map(schedule => ({
            name: subject.name,
            day: schedule.day,
            schedule: schedule.schedule,
          }));
        })

        const subjectObjects = await Promise.all(subjectPromises)
        const flattenedSubjectObjects = subjectObjects.flat()
        const response = {
          responses: flattenedSubjectObjects
        }

        callback(null, response);
      } catch (error) {
        console.error('Error processing subjects:', error);
        callback({ code: grpc.status.INTERNAL, details: "Internal error" });
      }
    },   
    GetByID: async(call, callback) => {
        const { subjectID } = call.request;
        try {
          const [subject] = await db.promise().execute('SELECT name FROM Subject WHERE subjectID = ?', [subjectID]);
          const name = subject[0].name

          const schedules = await new Promise((resolve, reject) => {
            db.query('SELECT day, schedule FROM Subject_Schedule WHERE subjectID = ?', [subjectID], (err, schedules) => {
              if(err) reject(err)
              resolve(schedules)
            })
          })

          const scheduleObjects = schedules.map(schedule => {
            return {
              name: name,
              day: schedule.day,
              schedule: schedule.schedule
            }
          });

          scheduleObjects.forEach(scheduleObject => call.write(scheduleObject));
          call.end();
        } catch (error) {
          console.error('Error processing subject:', error);
          callback({ code: grpc.status.INTERNAL, details: "Internal error" });
        }
    }
});

const port = '50051';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});