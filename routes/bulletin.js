import { Router } from 'express'
import { BulletinController } from '../controllers/bulletin.js'

export const createBulletinRouter = ({ bulletinModel }) => {
  const bulletinRouter = Router()

  const bulletinController = new BulletinController({ bulletinModel })

//   bulletinRouter.get('/', bulletinController.getBulletin)
//   bulletinRouter.post('/', bulletinController.create)

  bulletinRouter.get('/:CUIL', bulletinController.getBulletin)
//   bulletinRouter.delete('/:id', bulletinController.delete)
//   bulletinRouter.patch('/:id', bulletinController.update)

  return bulletinRouter
}
