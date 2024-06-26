import { Router } from 'express';
import { SubjectController } from '../controllers/subject.js';

export const createSubjectRouter = ({ subjectModel }) => {
  const subjectRouter = Router();

  const subjectController = new SubjectController({ subjectModel });

  subjectRouter.get('/', subjectController.getAll);

  subjectRouter.get('/:subjectID', subjectController.getByID);

  subjectRouter.post('/', subjectController.create);

  subjectRouter.delete('/:subjectID', subjectController.delete);

  subjectRouter.patch('/:subjectID', subjectController.update);

  return subjectRouter;
}
