import { Router } from 'express'
import { StudentController } from '../controllers/student.js'

export const createStudentRouter = ({ studentModel }) => {
  const studentRouter = Router()

  const studentController = new StudentController({ studentModel })

  studentRouter.get('/', studentController.getAll)
  studentRouter.post('/', studentController.create)

  studentRouter.get('/:CUIL', studentController.getById)
  studentRouter.delete('/:id', studentController.delete)
  studentRouter.patch('/:id', studentController.update)

  return studentRouter
}
