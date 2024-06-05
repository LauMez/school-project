export class CourseController {
  constructor ({ courseModel }) {
    this.courseModel = courseModel
  }

  getCourse = async (req, res) => {
    const { CUIL } = req.params
    const course = await this.courseModel.getCourse({ CUIL })
    if (course) return res.json(course)
    res.status(404).json({ message: 'Course not found' })
  }
}
