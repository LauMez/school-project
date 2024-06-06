export class BulletinController {
  constructor ({ bulletinModel }) {
    this.bulletinModel = bulletinModel
  }

  getAll = async(req, res) => {
    const bulletins = await this.bulletinModel.getAll()
    if(bulletins) return res.json(bulletins)
    res.status(404).json({ message: 'Bulletins not found' })
  }

  getByID = async (req, res) => {
    const { bulletinID } = req.params
    const bulletin = await this.bulletinModel.getByID({ bulletinID })
    if (bulletin) return res.json(bulletin)
    res.status(404).json({ message: 'Bulletin not found' })
  }
}
