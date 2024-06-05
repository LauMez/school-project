import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

const packageDefinition = protoLoader.loadSync('protos/subject.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const subjectservice = grpc.loadPackageDefinition(packageDefinition).subjectservice;

const subjectClient = new subjectservice.SubjectService('localhost:50051', grpc.credentials.createInsecure());

export class SubjectModel {
    static async getAll () {
        return new Promise((resolve, reject) => {
            const rows = [];
      
            const call = subjectClient.GetAll();
            call.on('data', (subject) => {
                rows.push(subject);
                console.log(rows)
            });
            call.on('end', () => {
                resolve(rows);
            });
            call.on('error', (e) => {
                reject(e);
            });
        });
    }

    static async getByID ({ subjectID }) {
        return new Promise((resolve, reject) => {
            subjectClient.GetByID({ subjectID }, (error, response) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(response);
              }
          });
      });
    }
}
