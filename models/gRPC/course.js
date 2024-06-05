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
    static async getCourse ({ CUIL }) {
        return new Promise((resolve, reject) => {
            courseClient.GetCourse({ CUIL }, (error, response) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(response);
              }
          });
      });
    }
}
