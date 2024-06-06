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
    GetAll: async(call, callback) => {
      try {
        const courses = await new Promise((resolve, reject) => {
          db.query('SELECT courseID FROM Course', (err, courses) => {
            if (err) reject(err);
            resolve(courses);
          });
        });

        const coursePromises = courses.map(async (course) => {
          const groups = await new Promise((resolve, reject) => {
            db.query('SELECT courseGroup FROM Course_Group WHERE courseID = ?', [course.courseID], (err, groups) => {
              if (err) reject(err);
              resolve(groups);
            });
          });
          const groupA = groups[0].courseGroup
          const groupB = groups[1].courseGroup

          const [thisCourse] = await db.promise().execute('SELECT year, division FROM Course WHERE courseID = ?', [course.courseID]);
          const year = thisCourse[0].year
          const division = thisCourse[0].division

          return {
            year: year,
            division: division,
            groupA: groupA,
            groupB: groupB
          }
        })

        const courseObjects = await Promise.all(coursePromises);
        courseObjects.forEach(courseObject => call.write(courseObject));
        call.end();
      } catch (error) {
        console.error('Error processing courses:', error);
        callback({ code: grpc.status.INTERNAL, details: "Internal error" });
      }
    },
    GetByID: async(call, callback) => {
        const { courseID } = call.request;

        const groups = await new Promise((resolve, reject) => {
          db.query('SELECT courseGroup FROM Course_Group WHERE courseID = ?', [courseID], (err, groups) => {
            if (err) reject(err);
            resolve(groups);
          });
        });
        const groupA = groups[0].courseGroup
        const groupB = groups[1].courseGroup

        db.query('SELECT year, division FROM Course WHERE courseID = ?', [courseID], (err, thisCourse) => {
          if (err) {
              callback({ code: grpc.status.INTERNAL, details: "Internal error" });
          }  
          const year = thisCourse[0].year
          const division = thisCourse[0].division

          callback(null, { year: year, division: division, groupA: groupA, groupB: groupB })
      })
    }
});

const port = '50053';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});