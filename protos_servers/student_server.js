import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { StudentModel } from '../models/gRPC/student.js';

const packageDefinition = protoLoader.loadSync('../protos/student.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const studentservice = grpc.loadPackageDefinition(packageDefinition).studentservice;

const server = new grpc.Server();

server.addService(studentservice.StudentService.service, {
  GetAll: async(call, callback) => {
    try{
      const students = await StudentModel.getAll();
      callback(null, students);
    } catch (error) {
      console.error('Error processing students:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  },
  GetByID: async(call, callback) => {
    const { CUIL } = call.request;
    try{
      const student = await StudentModel.getByID({CUIL});
      callback(null, student);
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