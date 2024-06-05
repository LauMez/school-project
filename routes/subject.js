import { Router } from 'express'
import { SubjectController } from '../controllers/subject.js'

export const createSubjectRouter = ({ subjectModel }) => {
  const subjectRouter = Router()

  const subjectController = new SubjectController({ subjectModel })

  subjectRouter.get('/', subjectController.getAll)
  subjectRouter.get('/:subjectID', subjectController.getByID)

  return subjectRouter
}
