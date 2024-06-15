import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const packageDefinition = protoLoader.loadSync('../protos/student.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const studentservice = grpc.loadPackageDefinition(packageDefinition).studentservice;

const server = new grpc.Server();
const db = mysql.createConnection(connectionString);

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  };

  console.log('Connected to database.');
});

server.addService(studentservice.StudentService.service, {
  GetAll: async(call, callback) => {
    try {
      const students = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Personal_Information', (err, students) => {
          if (err) reject(err);

          resolve(students);
        });
      });

      if (students.length === 0) {
        console.error('Students not found');
        call.end();
      };

      const studentPromises = students.map(async (student) => {
        const [StudentInfo] = await db.promise().execute('SELECT blood_type, social_work FROM Student_Information WHERE CUIL = ?', [student.CUIL]);

        const studentInfo = StudentInfo[0];

        if (!studentInfo) {
          console.error('Student ifno not found with CUIL:', student.CUIL);
          call.end();
        };

        return {
          CUIL: student.CUIL,
          DNI: student.DNI,
          first_name: student.first_name,
          second_name: student.second_name,
          last_name1: student.last_name1,
          last_name2: student.last_name2,
          phone_number: student.phone_number,
          landline_phone_number: student.landline_phone_number,
          direction: student.direction,
          blood_type: studentInfo.blood_type,
          social_work: studentInfo.social_work
        };
      });

      const bulletinObjects = await Promise.all(studentPromises);

      bulletinObjects.forEach(studentObject => call.write(studentObject));

      call.end();
    } catch (error) {
      console.error('Error processing students:', error);
      call.emit('error', { code: grpc.status.INTERNAL, details: "Internal error" });
    };
  },
  GetByID: async(call, callback) => {
    const { CUIL } = call.request;

    try {
      const [Student] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL]);

      const student = Student[0];

      if (!student) {
        console.error('Student not found with CUIL:', CUIL);
        callback(null, Student);
        return;
      };

      const [StudentInfo] = await db.promise().execute('SELECT blood_type, social_work FROM Student_Information WHERE CUIL = ?', [CUIL]); 

      const studentInfo = StudentInfo[0];

      if (!studentInfo) {
        console.error('Student info not found with CUIL:', CUIL);
        callback(null, StudentInfo);
        return;
      };

      callback(null, { CUIL: student.CUIL, DNI: student.DNI, first_name: student.first_name, second_name: student.second_name, last_name1: student.last_name1, last_name2: student.last_name2, phone_number: student.phone_number, landline_phone_number: student.landline_phone_number, direction: student.direction, blood_type: studentInfo.blood_type, social_work: studentInfo.social_work });
    } catch (error) {
      console.error('Error processing student:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  }
});

const port = '50052';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});