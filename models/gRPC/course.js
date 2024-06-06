import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

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
            const courses = [];
      
            const call = courseClient.GetAll();
            call.on('data', (course) => {
                courses.push(course);
            });
            call.on('end', () => {
                resolve(courses);
            });
            call.on('error', (e) => {
                reject(e);
            });
        });
    }

    static async getByID ({ courseID }) {
        return new Promise((resolve, reject) => {
            courseClient.GetByID({ courseID }, (error, response) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(response);
              }
          });
      });
    }
}
