import { validateCourse, validatePartialCourse } from "../schemas/course.js";

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

  create = async (req, res) => {
    const result = validateCourse(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    

    const newCourse = await this.courseModel.create({ input: result.data });

    res.status(201).json(newCourse);
  }

  delete = async (req, res) => {
    const { courseID } = req.params;

    const result = await this.courseModel.delete({ CUIL });

    if (result === false) return res.status(404).json({ message: 'Student not found' });
    
    return res.json({ message: 'Course deleted' });
  };

  update = async (req, res) => {
    const result = validatePartialStudent(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { courseID } = req.params;

    const updatedCourse = await this.courseModel.update({ CUIL, input: result.data });

    return res.json({message: 'Course updating'});
  };
};
