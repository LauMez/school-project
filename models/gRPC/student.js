// import client from '../../student_client.js'
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

const packageDefinition = protoLoader.loadSync('student.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const studentservice = grpc.loadPackageDefinition(packageDefinition).studentservice;

const studentClient = new studentservice.StudentService('localhost:50051', grpc.credentials.createInsecure());

export class StudentModel {
  static async getAll () {
    return new Promise((resolve, reject) => {
      const rows = [];

      const call = studentClient.GetAll();
      call.on('data', (data) => {
          rows.push(data);
      });
      call.on('end', () => {
          resolve(rows);
      });
      call.on('error', (e) => {
          reject(e);
      });
  });
  }

  static async getById ({ CUIL }) {
    return new Promise((resolve, reject) => {
      studentClient.GetStudent({ CUIL }, (error, response) => {
          if (error) {
              reject(error);
          } else {
              resolve(response);
          }
      });
  });
  }
}
