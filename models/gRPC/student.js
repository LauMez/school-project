import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('protos/student.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const studentservice = grpc.loadPackageDefinition(packageDefinition).studentservice;

const studentClient = new studentservice.StudentService('localhost:50052', grpc.credentials.createInsecure());

export class StudentModel {
  static async getAll () {
    return new Promise((resolve, reject) => {
      const students = [];

      const call = studentClient.GetAll();

      call.on('data', (student) => {
        students.push(student);
      });
      call.on('end', () => {
        resolve(students);
      });
      call.on('error', () => {
        reject(new Error('Internal server error'));
      });
    });
  };

  static async getByID ({ CUIL }) {
    return new Promise((resolve, reject) => {
      studentClient.GetByID({ CUIL }, (error, student) => {
        if(!student) {
          const student = [];
          resolve(student);
        };

        if (error) return reject(new Error('Internal server error'));

        resolve(student);
      });
    });
  };
};
