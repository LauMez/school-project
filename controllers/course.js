export class CourseController {
  constructor ({ courseModel }) {
    this.courseModel = courseModel
  }

  getAll = async (req, res) => {
    const courses = await this.courseModel.getAll()
    if(courses) return res.json(courses)
    res.status(404).json({ message: 'Courses not found' })
  }

  getByID = async (req, res) => {
    const { courseID } = req.params
    const course = await this.courseModel.getByID({ courseID })
    if (course) return res.json(course)
    res.status(404).json({ message: 'Course not found' })
  }
}
