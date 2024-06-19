import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';

export const createAuthRouter = ({ authModel }) => {
  const authRouter = Router();

  const authController = new AuthController({ authModel });

  authRouter.get('/', authController.getAll);
  authRouter.get('/:bulletinID', authController.getByID);

  return authRouter;
};
