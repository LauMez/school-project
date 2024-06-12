import { Router } from 'express';
import { BulletinController } from '../controllers/bulletin.js';

export const createBulletinRouter = ({ bulletinModel }) => {
  const bulletinRouter = Router();

  const bulletinController = new BulletinController({ bulletinModel });

  bulletinRouter.get('/', bulletinController.getAll);
  bulletinRouter.get('/:bulletinID', bulletinController.getByID);

  return bulletinRouter;
};
