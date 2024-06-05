export class SubjectController {
    constructor ({ subjectModel }) {
      this.subjectModel = subjectModel
    }

    getAll = async (req, res) => {
        const subjects = await this.subjectModel.getAll()
        if(subjects) return res.json(subjects)
        res.status(404).json({ message: 'Subjects not found' })
    }
  
    getByID = async (req, res) => {
      const { subjectID } = req.params
      const subject = await this.subjectModel.getByID({ subjectID })
      if (subject) return res.json(subject)
      res.status(404).json({ message: 'Subject not found' })
    }
  }
  