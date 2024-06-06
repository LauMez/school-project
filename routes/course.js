import { Router } from 'express'
import { CourseController } from '../controllers/course.js'

export const createCourseRouter = ({ courseModel }) => {
  const courseRouter = Router()

  const courseController = new CourseController({ courseModel })

  courseRouter.get('/', courseController.getAll)
  courseRouter.get('/:courseID', courseController.getByID)

  return courseRouter
}
