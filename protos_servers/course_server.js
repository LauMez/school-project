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
          db.query('SELECT courseID, year, division FROM Course', (err, courses) => {
            if (err) reject(err);
            resolve(courses);
          });
        });

        if (courses.length === 0) {
          console.error('Courses not found');
          callback(null, courses);
        }

        const coursePromises = courses.map(async (course) => {
          const groups = await new Promise((resolve, reject) => {
            db.query('SELECT courseGroup FROM Course_Group WHERE courseID = ?', [course.courseID], (err, groups) => {
              if (err) reject(err);
              resolve(groups);
            });
          });

          if (!groups) {
            console.error('Groups not found:');
            callback({code: grpc.status.NOT_FOUND, message: "Groups not found" });
            return;
          }

          return groups.map(group => ({
            year: course.year,
            division: course.division,
            group: group.courseGroup,
          }));
        })

        const courseObjects = await Promise.all(coursePromises)
        const flattenedCourseObjects = courseObjects.flat()
        const response = {
          responses: flattenedCourseObjects
        }

        callback(null, response);
      } catch (error) {
        console.error('Error processing courses:', error);
        callback({ code: grpc.status.INTERNAL, details: "Internal error" });
      }
    },
    GetByID: async(call, callback) => {
        const { courseID } = call.request;

        try {
          const [course] = await db.promise().execute('SELECT year, division FROM Course WHERE courseID = ?', [courseID]);

          if (!course[0]) {
            console.error('Course not found with ID:', courseID);
            call.end()
            return;
          }

          const year = course[0].year
          const division = course[0].division

          const groups = await new Promise((resolve, reject) => {
            db.query('SELECT courseGroup FROM Course_Group WHERE courseID = ?', [courseID], (err, groups) => {
              if (err) reject(err);
              resolve(groups);
            });
          });

          if (!groups) {
            console.error('Groups not found with ID:', courseID);
            call.emit('error', { code: grpc.status.NOT_FOUND, message: "Groups not found" });
            return;
          }

          const groupsObjects = groups.map(group => {
            return {
              year: year,
              division: division,
              group: group.courseGroup
            }
          })

          groupsObjects.forEach(groupsObject => call.write(groupsObject));
          call.end();
        } catch (error) {
          console.error('Error processing course:', error);
          call.emit('error', { code: grpc.status.INTERNAL, details: "Internal error" });
        }
    }
});

const port = '50053';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});