import { validateCourse, validatePartialCourse, validateGroup } from "../schemas/course.js";

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

    res.status(201).json({message: 'Course created'});
  }

  createCourse = async (req, res) => {
    const { courseID } = req.params;

    const result = validateGroup(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const newGroup = await this.courseModel.createCourse({ courseID, input: result.data });

    res.status(201).json(newGroup);
  };

  delete = async (req, res) => {
    const { courseID } = req.params;

    const result = await this.courseModel.delete({ courseID });

    if (result === false) return res.status(404).json({ message: 'Course not found' });
    
    return res.json({ message: 'Course deleted' });
  };

  update = async (req, res) => {
    const result = validatePartialCourse(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { courseID } = req.params;

    const updatedCourse = await this.courseModel.update({ courseID, input: result.data });

    return res.json({message: 'Course updating'});
  };
};
