import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('protos/course.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const courseservice = grpc.loadPackageDefinition(packageDefinition).courseservice;

const courseClient = new courseservice.CourseService('localhost:50053', grpc.credentials.createInsecure());

export class CourseModel {
    static async getAll () {
        return new Promise((resolve, reject) => {
            courseClient.GetAll({}, (error, response) => {
                if(!response) {
                    const courses = [];
                    resolve(courses);
                };

                if (error) return reject(new Error('Internal server error'));

                const courses = response.responses;
                resolve(courses);
            });
        });
    };

    static async getByID ({ courseID }) {
        return new Promise((resolve, reject) => {
            const courseGroups = [];

            const call = courseClient.GetByID({courseID});
            
            call.on('data', (course) => {
                courseGroups.push(course);
            });
            call.on('end', () => {
                resolve(courseGroups);
            });
            call.on('error', () => {
                reject(new Error('Internal server error'));
            });
        });
    };
};
