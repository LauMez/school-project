import { Router } from 'express';
import { CourseController } from '../controllers/course.js';

export const createCourseRouter = ({ courseModel }) => {
  const courseRouter = Router();

  const courseController = new CourseController({ courseModel });

  courseRouter.get('/', courseController.getAll);
  courseRouter.post('/', courseController.create);
  courseRouter.post('/:courseID', courseController.createCourse);

  courseRouter.get('/:courseID', courseController.getByID);
  courseRouter.delete('/:courseID', courseController.delete);
  courseRouter.patch('/:courseID', courseController.update);

  return courseRouter;
}
