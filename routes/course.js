import { Router } from 'express'
import { CourseController } from '../controllers/course.js'

export const createCourseRouter = ({ courseModel }) => {
  const courseRouter = Router()

  const courseController = new CourseController({ courseModel })

//   bulletinRouter.get('/', bulletinController.getBulletin)
//   bulletinRouter.post('/', bulletinController.create)

  courseRouter.get('/:CUIL', courseController.getCourse)
//   bulletinRouter.delete('/:id', bulletinController.delete)
//   bulletinRouter.patch('/:id', bulletinController.update)

  return courseRouter
}
