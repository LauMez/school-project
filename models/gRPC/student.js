import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const db = mysql.createConnection(connectionString);

db.connect(err => {
  if (err) {
    console.error('Student database connection failed:', err.stack);
    return;
  };

  console.log('Connected to student database.');
});

export class StudentModel {
  static async getAll () {
    try {
      const students = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Personal_Information', (err, students) => {
          if (err) reject(err);

          resolve(students);
        });
      });

      if (students.length === 0) {
        console.error('Students not found');
        return [];
      };

      const studentPromises = students.map(async (student) => {
        const [StudentInfo] = await db.promise().execute('SELECT blood_type, social_work FROM Student_Information WHERE CUIL = ?', [student.CUIL]);

        const studentInfo = StudentInfo[0];

        if (!studentInfo) {
          console.error('Student ifno not found with CUIL:', student.CUIL);
          return [];
        };

        return {
          CUIL: student.CUIL,
          DNI: student.DNI,
          first_name: student.first_name,
          second_name: student.second_name,
          last_name1: student.last_name1,
          last_name2: student.last_name2,
          phone_number: student.phone_number,
          landline_phone_number: student.landline_phone_number,
          direction: student.direction,
          blood_type: studentInfo.blood_type,
          social_work: studentInfo.social_work
        };
      });

      const bulletinObjects = await Promise.all(studentPromises);

      return bulletinObjects;
    } catch (error) {
      console.error('Error processing students:', error);
      throw new Error('Internal server error');
    };
  };

  static async getByID ({ CUIL }) {
    try {
      const [Student] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL]);

      const student = Student[0];

      if (!student) {
        console.error('Student not found with CUIL:', CUIL);
        return [];
      };

      const [StudentInfo] = await db.promise().execute('SELECT blood_type, social_work FROM Student_Information WHERE CUIL = ?', [CUIL]); 

      const studentInfo = StudentInfo[0];

      if (!studentInfo) {
        console.error('Student info not found with CUIL:', CUIL);
        return [];
      };

      return {
        CUIL: CUIL, 
        DNI: student.DNI, 
        first_name: student.first_name, 
        second_name: student.second_name, 
        last_name1: student.last_name1, 
        last_name2: student.last_name2, 
        phone_number: student.phone_number, 
        landline_phone_number: student.landline_phone_number, 
        direction: student.direction, 
        blood_type: studentInfo.blood_type, 
        social_work: studentInfo.social_work
      };
    } catch (error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    };
  };

  static async create ({input}) {
    const {
      CUIL,
      DNI,
      first_name,
      second_name,
      last_name1,
      last_name2,
      phone_number,
      landline_phone_number,
      direction,
      blood_type,
      social_work
    } = input;

    try {
      await db.promise().execute('INSERT INTO Student (CUIL) VALUES (?);', [CUIL]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating student: ');
    }

    try {
      await db.promise().execute('INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);', [CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating personal information');
    }

    try {
      await db.promise().execute('INSERT INTO Student_Information (CUIL, blood_type, social_work) VALUES(?, ?, ?);', [CUIL, blood_type, social_work]);
    }  catch (e) {
      throw new Error('Error creating student information');
    }

    const [PersonalInformation] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL]);
    
    const personalInformation = PersonalInformation[0];

    const [StudentInformation] = await db.promise().execute('SELECT blood_type, social_work FROM Student_Information WHERE CUIL = ?', [CUIL]);

    const studentInformation = StudentInformation[0];

    return {
      CUIL: personalInformation.CUIL,
      DNI: personalInformation.DNI,
      first_name: personalInformation.first_name,
      second_name: personalInformation.second_name,
      last_name1: personalInformation.last_name1,
      last_name2: personalInformation.last_name2,
      phone_number: personalInformation.phone_number,
      landline_phone_number: personalInformation.landline_phone_number,
      direction: personalInformation.direction,
      blood_type: studentInformation.blood_type,
      social_work: studentInformation.social_work
    };
  };

  static async delete ({CUIL}) {
    try {
      await db.promise().execute('DELETE FROM Student_Information WHERE CUIL = ?', [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting student information');
    }

    try {
      await db.promise().execute('DELETE FROM Personal_Information WHERE CUIL = ?', [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting personal information');
    }
    
    try {
      await db.promise().execute('DELETE FROM Student WHERE CUIL = ?', [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting student');
    }

    return;
  };
};
