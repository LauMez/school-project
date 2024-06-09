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
        // return new Promise((resolve, reject) => {
        //     const subjects = [];
      
        //     const call = subjectClient.GetAll();
        //     call.on('data', (subject) => {
        //         subjects.push(subject);
        //         console.log(subjects)
        //     });
        //     call.on('end', () => {
        //         resolve(subjects);
        //     });
        //     call.on('error', (e) => {
        //         reject(e);
        //     });
        // });

        return new Promise((resolve, reject) => {
            subjectClient.GetAll({}, (error, response) => {
                if (error) return reject(error);

                const subjects = response.responses;
                resolve(subjects);
            });
        })
    }

    static async getByID ({ subjectID }) {
        return new Promise((resolve, reject) => {
            const subjectSchedules = [];
    
            const call = subjectClient.GetByID({subjectID});
            call.on('data', (subject) => {
                subjectSchedules.push(subject);
                console.log(subjectSchedules)
            });
            call.on('end', () => {
                resolve(subjectSchedules);
            });
            call.on('error', (e) => {
                reject(e);
            });
        });
    }
}
