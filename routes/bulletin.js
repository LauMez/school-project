import { Router } from 'express'
import { BulletinController } from '../controllers/bulletin.js'

export const createBulletinRouter = ({ bulletinModel }) => {
  const bulletinRouter = Router()

  const bulletinController = new BulletinController({ bulletinModel })

  bulletinRouter.get('/', bulletinController.getAll)
//   bulletinRouter.post('/', bulletinController.create)

  bulletinRouter.get('/:bulletinID', bulletinController.getByID)
//   bulletinRouter.delete('/:id', bulletinController.delete)
//   bulletinRouter.patch('/:id', bulletinController.update)

  return bulletinRouter
}
