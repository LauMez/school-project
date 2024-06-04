export class BulletinController {
  constructor ({ bulletinModel }) {
    this.bulletinModel = bulletinModel
  }

  getBulletin = async (req, res) => {
    const { CUIL } = req.params
    const bulletin = await this.bulletinModel.getBulletin({CUIL})
    if (bulletin) return res.json(bulletin)
    res.status(404).json({ message: 'Bulletin not found' })
  }
}
