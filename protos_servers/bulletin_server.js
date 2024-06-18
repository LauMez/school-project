import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { BulletinModel } from '../models/gRPC/bulletin';

const packageDefinition = protoLoader.loadSync('../protos/bulletin.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const bulletinservice = grpc.loadPackageDefinition(packageDefinition).bulletinservice;

const server = new grpc.Server();

server.addService(bulletinservice.BulletinService.service, {
  GetAll: async (call, callback) => {
    try{
      const bulletins = await BulletinModel.getAll();
      callback(null, bulletins);
    } catch (error) {
      console.error('Error processing bulletins:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  }, 
  GetByID: async(call, callback) => {
    const { bulletinID } = call.request;
    try{
      const bulletin = await BulletinModel.getByID({bulletinID});
      callback(null, bulletin);
    } catch (error) {
      console.error('Error processing bulletin:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  }
});

const port = '50054';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});