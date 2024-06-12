import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('protos/bulletin.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const bulletinservice = grpc.loadPackageDefinition(packageDefinition).bulletinservice;

const bulletinClient = new bulletinservice.BulletinService('localhost:50054', grpc.credentials.createInsecure());

export class BulletinModel {
    static async getAll () {
        return new Promise((resolve, reject) => {
            const bulletins = [];
      
            const call = bulletinClient.GetAll();
            
            call.on('data', (bulletin) => {
                bulletins.push(bulletin);
            });
            call.on('end', () => {
                resolve(bulletins);
            });
            call.on('error', () => {
                reject(new Error('Internal server error'));
            });
        });
    };

    static async getByID ({ bulletinID }) {
        return new Promise((resolve, reject) => {
            bulletinClient.GetByID({ bulletinID }, (error, bulletin) => {
            if(!bulletin) {
                const bulletin = [];
                resolve(bulletin);
            };

            if (error) return reject(new Error('Internal server error'));

            resolve(bulletin);
          });
      });
    };
};