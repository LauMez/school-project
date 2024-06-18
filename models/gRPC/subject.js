import mysql from 'mysql2';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const DEFAULT_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'subjectDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;
const db = mysql.createConnection(connectionString);

db.connect(err => {
    if (err) {
        console.error('Subject database connection failed:', err.stack);
        return;
    }
    console.log('Connected to subject database.');
});

const packageDefinition = protoLoader.loadSync('C:/Users/LauMez/OneDrive/Desktop/school-project/protos/course.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const courseservice = grpc.loadPackageDefinition(packageDefinition).courseservice;
const grpcClient = new courseservice.CourseService('localhost:50053', grpc.credentials.createInsecure());
export class SubjectModel {
    static async getAll () {
        try{
            const subjects = await new Promise((resolve, reject) => {
              db.query('SELECT subjectID, courseID, name FROM Subject', (err, subjects) => {
                if (err) reject(err);
                resolve(subjects);
              });
            });
      
            if (subjects.length === 0) {
              console.error('Subjects not found');
              return [];
            };
      
            const subjectPromises = subjects.map(async (subject) => {
              const schedules = await new Promise((resolve, reject) => {
                db.query('SELECT day, schedule FROM Subject_Schedule WHERE subjectID = ?', [subject.subjectID], (err, schedules) => {
                  if(err) reject(err);
      
                  resolve(schedules);
                });
              });
      
              if (schedules.length === 0) {
                console.error('Schedules not found:');
                return [];
              };

              const courseID = subject.courseID;
              console.log('courseID: ', courseID);
              grpcClient.GetByID({courseID}, (error, subjects) => {
                if (error) {
                  console.error('Error calling gRPC getAll:', error);
                  throw new Error('gRPC call failed');
                }
                console.log(subjects.responses);
              });
      
              return schedules.map(schedule => ({
                name: subject.name,
                day: schedule.day,
                schedule: schedule.schedule,
              }));
            });
      
            const subjectObjects = await Promise.all(subjectPromises);
            const flattenedSubjectObjects = subjectObjects.flat();
            const response = { 
              responses: flattenedSubjectObjects
            };

            return response.responses;
        } catch (error) {
            console.error('Error processing subjects:', error);
            throw new Error('Internal server error');
        };
    };

    static async getByID ({ subjectID }) {
        try {
        const [Subject] = await db.promise().execute('SELECT name FROM Subject WHERE subjectID = ?', [subjectID]);

        const subject = Subject[0];

        if (!subject) {
            console.error('Subject not found with ID:', subjectID);
            return [];
        };

        const schedules = await new Promise((resolve, reject) => {
            db.query('SELECT day, schedule FROM Subject_Schedule WHERE subjectID = ?', [subjectID], (err, schedules) => {
            if(err) reject(err);

            resolve(schedules);
            });
        });

        if (!schedules) {
            console.error('Schedules not found with ID:', subjectID);
            return [];
        };

        const scheduleObjects = schedules.map(schedule => {
            return {
            name: subject.name,
            day: schedule.day,
            schedule: schedule.schedule
            };
        });

        return scheduleObjects;
        } catch (error) {
        console.error('Error processing subject:', error);
        };
    };
};
