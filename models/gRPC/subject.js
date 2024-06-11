import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

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
            subjectClient.GetAll({}, (error, response) => {
                if(!response) {
                    const subjects = [];
                    resolve(subjects);
                };

                if (error) return reject(new Error('Internal server error'));

                const subjects = response.responses;
                resolve(subjects);
            });
        });
    };

    static async getByID ({ subjectID }) {
        return new Promise((resolve, reject) => {
            const subjectSchedules = [];
    
            const call = subjectClient.GetByID({subjectID});

            call.on('data', (subject) => {
                subjectSchedules.push(subject);
            });
            call.on('end', () => {
                resolve(subjectSchedules);
            });
            call.on('error', () => {
                reject(new Error('Internal server error'));
            });
        });
    };
};
