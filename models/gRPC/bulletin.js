import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

const packageDefinition = protoLoader.loadSync('bulletin.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const bulletinservice = grpc.loadPackageDefinition(packageDefinition).bulletinservice;

const bulletinClient = new bulletinservice.BulletinService('localhost:50051', grpc.credentials.createInsecure());

export class BulletinModel {
    static async getBulletin ({ CUIL }) {
        return new Promise((resolve, reject) => {
            bulletinClient.GetBulletin({ CUIL }, (error, response) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(response);
              }
          });
      });
    }
}
