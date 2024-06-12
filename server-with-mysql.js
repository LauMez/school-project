import { createApp } from './app.js';

import { StudentModel } from './models/gRPC/student.js';
import { BulletinModel } from './models/gRPC/bulletin.js';
import { CourseModel } from './models/gRPC/course.js';
import { SubjectModel } from './models/gRPC/subject.js';

createApp({ studentModel: StudentModel, bulletinModel: BulletinModel, courseModel: CourseModel, subjectModel: SubjectModel });