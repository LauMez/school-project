export class SubjectController {
  constructor ({ subjectModel }) {
    this.subjectModel = subjectModel;
  };

  getAll = async (req, res) => {
    try {
      const subjects = await this.subjectModel.getAll();

      if (subjects.length === 0) return res.status(404).json({ message: 'Subjects not found' });

      return res.json(subjects);
    } catch (error) {
      console.error('Error occurred while fetching subjects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByID = async (req, res) => {
    const { subjectID } = req.params;

    try {
      const subject = await this.subjectModel.getByID({ subjectID });

      if (subject.length === 0) return res.status(404).json({ message: 'Subject not found' });

      return res.json(subject);
    } catch (error) {
      console.error('Error occurred while fetching subject:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  create = async (req, res) => {
    const result = validateSubject(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    
    const newSubject = await this.subjectModel.create({ input: result.data });

    res.status(201).json({message: 'Subject created'});
  }
};