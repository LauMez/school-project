export class CourseController {
  constructor ({ courseModel }) {
    this.courseModel = courseModel;
  };

  getAll = async (req, res) => {
    try {
      const courses = await this.courseModel.getAll();

      if (courses.length === 0) return res.status(404).json({ message: 'Courses not found' });

      return res.json(courses);
    } catch (error) {
      console.error('Error occurred while fetching courses:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByID = async (req, res) => {
    const { courseID } = req.params

    try {
      const course = await this.courseModel.getByID({ courseID });

      if (course.length === 0) return res.status(404).json({ message: 'Course not found' });

      return res.json(course);
    } catch (error) {
        console.error('Error occurred while fetching course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    };
  };
};
