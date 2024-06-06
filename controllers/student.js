import { validateMovie, validatePartialMovie } from '../schemas/student.js'

export class StudentController {
  constructor ({ studentModel }) {
    this.studentModel = studentModel
  }

  getAll = async (req, res) => {
    const students = await this.studentModel.getAll()
    if (students) return res.json(students)
    res.status(404).json({ message: 'Students not found' })
  }

  getByID = async (req, res) => {
    const { CUIL } = req.params
    const student = await this.studentModel.getByID({ CUIL })
    if (student) return res.json(student)
    res.status(404).json({ message: 'Student not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
    // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newStudent = await this.studentModel.create({ input: result.data })

    res.status(201).json(newStudent)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.studentModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Student deleted' })
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedStudent = await this.studentModel.update({ id, input: result.data })

    return res.json(updatedStudent)
  }
}
