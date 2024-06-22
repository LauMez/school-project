import { validateStudent } from "../schemas/student.js";

export class StudentController {
  constructor ({ studentModel }) {
    this.studentModel = studentModel
  };

  getAll = async (req, res) => {
    try {
      const students = await this.studentModel.getAll();

      if (students.length === 0) return res.status(404).json({ message: 'Students not found' });

      return res.json(students);
    } catch (error) {
      console.error('Error occurred while fetching students:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByID = async (req, res) => {
    const { CUIL } = req.params;

    try {
      const student = await this.studentModel.getByID({ CUIL });

      if (student.length === 0) return res.status(404).json({ message: 'Student not found' });
  
      return res.json(student);
    } catch (error) {
      console.error('Error occurred while fetching student:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  create = async (req, res) => {
    const result = validateStudent(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    

    const newStudent = await this.studentModel.create({ input: result.data });

    res.status(201).json(newStudent);
  }

  delete = async (req, res) => {
    const { CUIL } = req.params;

    const result = await this.studentModel.delete({ CUIL });

    if (result === false) return res.status(404).json({ message: 'Student not found' });
    
    return res.json({ message: 'Student deleted' });
  }

  // update = async (req, res) => {
  //   const result = validatePartialMovie(req.body)

  //   if (!result.success) {
  //     return res.status(400).json({ error: JSON.parse(result.error.message) })
  //   }

  //   const { id } = req.params

  //   const updatedStudent = await this.studentModel.update({ id, input: result.data })

  //   return res.json(updatedStudent)
  // }
};