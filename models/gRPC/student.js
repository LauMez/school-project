import mysql from 'mysql2';

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const db = mysql.createConnection(connectionString);

const packageDefinition = protoLoader.loadSync('C:/Users/LauMez/OneDrive/Desktop/school-project/protos/subject.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const subjectservice = grpc.loadPackageDefinition(packageDefinition).subjectservice;
const grpcClient = new subjectservice.SubjectService('localhost:50051', grpc.credentials.createInsecure());

db.connect(err => {
  if (err) {
    console.error('Student database connection failed:', err.stack);
    return;
  };

  console.log('Connected to student database.');
});

export class StudentModel {
  static async getAll () {
    try {
      const students = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Personal_Information', (err, students) => {
          if (err) reject(err);

          resolve(students);
        });
      });

      if (students.length === 0) {
        console.error('Students not found');
        return [];
      };

      const studentPromises = students.map(async (student) => {
        const [StudentInfo] = await db.promise().execute('SELECT blood_type, social_work FROM Student_Information WHERE CUIL = ?', [student.CUIL]);

        const studentInfo = StudentInfo[0];

        if (!studentInfo) {
          console.error('Student ifno not found with CUIL:', student.CUIL);
          return [];
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
      grpcClient.getAll({}, (error, subjects) => {
        if (error) {
          console.error('Error calling gRPC getAll:', error);
          throw new Error('gRPC call failed');
        }
        console.log(subjects.responses);
      });

      return bulletinObjects;
    } catch (error) {
      console.error('Error processing students:', error);
      throw new Error('Internal server error');
    };
  };

  static async getByID ({ CUIL }) {
    try {
      const [Student] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL]);

      const student = Student[0];

      if (!student) {
        console.error('Student not found with CUIL:', CUIL);
        return [];
      };

      const [StudentInfo] = await db.promise().execute('SELECT blood_type, social_work FROM Student_Information WHERE CUIL = ?', [CUIL]); 

      const studentInfo = StudentInfo[0];

      if (!studentInfo) {
        console.error('Student info not found with CUIL:', CUIL);
        return [];
      };

      return {
        CUIL: CUIL, 
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
    } catch (error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    };
  };
};
