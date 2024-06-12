export class BulletinController {
  constructor ({ bulletinModel }) {
    this.bulletinModel = bulletinModel;
  };

  getAll = async(req, res) => {
    try {
      const bulletins = await this.bulletinModel.getAll();
      if (bulletins.length === 0) return res.status(404).json({ message: 'Bulletins not found' });

      return res.json(bulletins);
    } catch (error) {
      console.error('Error occurred while fetching bulletins:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByID = async (req, res) => {
    const { bulletinID } = req.params;

    try {
      const bulletin = await this.bulletinModel.getByID({ bulletinID });

      if (bulletin.length === 0) return res.status(404).json({ message: 'Bulletin not found' });

      return res.json(bulletin);
    } catch (error) {
      console.error('Error occurred while fetching bulletin:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };
};
