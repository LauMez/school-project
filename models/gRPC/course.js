import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'courseDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const db = mysql.createConnection(connectionString);

db.connect(err => {
  if (err) {
    console.error('Course database connection failed:', err.stack);
    return;
  };

  console.log('Connected to course database.');
});
export class CourseModel {
  static async getAll () {
      try {
          const courses = await new Promise((resolve, reject) => {
            db.query('SELECT courseID, year, division FROM Course', (err, courses) => {
              if (err) reject(err);
              resolve(courses);
            });
          });
    
          if (courses.length === 0) {
            return [];
          };
    
          const coursePromises = courses.map(async (course) => {
            const groups = await new Promise((resolve, reject) => {
              db.query('SELECT courseGroup FROM Course_Group WHERE courseID = ?', [course.courseID], (err, groups) => {
                if (err) reject(err);
    
                resolve(groups);
              });
            });
    
            if (!groups) {
              console.error('Groups not found:');
              return [];
            };
    
            return groups.map(group => ({
              courseID: course.courseID,
              year: course.year,
              division: course.division,
              group: group.courseGroup,
            }));
          });
    
          const courseObjects = await Promise.all(coursePromises);
          const flattenedCourseObjects = courseObjects.flat();
          const response = {
            responses: flattenedCourseObjects
          };
    
          return response;
      } catch (error) {
          console.error('Error processing courses:', error);
          throw new Error('Internal server error');
      };
  };

  static async getByID ({ courseID }) {
    try {
      const [Course] = await db.promise().execute(`SELECT year, division FROM Course WHERE courseID = UUID_TO_BIN("${courseID}")`);
      const course = Course[0];

      if (!course) {
        console.error('Course not found with ID:', courseID);
        return [];
      };

      const groups = await new Promise((resolve, reject) => {
        db.query(`SELECT courseGroup FROM Course_Group WHERE courseID = UUID_TO_BIN("${courseID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      if (!groups) {
        console.error('Groups not found with ID:', courseID);
        return [];
      };

      const groupsObjects = groups.map(group => {
        return {
          year: course.year,
          division: course.division,
          group: group.courseGroup
        };
      });

      return groupsObjects;
    } catch (error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
    };
  };

  static async create ({input}) {
    const {
      year,
      division,
      group
    } = input;

    const [uuidCourse] = await db.promise().execute('SELECT UUID() courseID;')
    const [{ courseID }] = uuidCourse;

    try {
      await db.promise().execute(`INSERT INTO Course (courseID, year, division) VALUES (UUID_TO_BIN("${courseID}"), ?, ?);`, [year, division]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating course: ');
    }

    const [uuidGroup] = await db.promise().execute('SELECT UUID() courseGroupID;');
    const [{ courseGroupID }] = uuidGroup;

    try {
      await db.promise().execute(`INSERT INTO Course_Group (courseGroupID, courseID, courseGroup) VALUES(UUID_TO_BIN("${courseGroupID}"), UUID_TO_BIN("${courseID}"), ?);`, [group]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating course group');
    }

    try {
      const [Course] = await db.promise().execute(`SELECT year, division FROM Course WHERE courseID = UUID_TO_BIN("${courseID}")`);

      const course = Course[0];

      if (!course) {
        console.error('Course not found with ID:', courseID);
        return [];
      };

      const groups = await new Promise((resolve, reject) => {
        db.query(`SELECT courseGroup FROM Course_Group WHERE courseID = UUID_TO_BIN("${courseID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      if (!groups) {
        console.error('Groups not found with ID:', courseID);
        return [];
      };

      const groupsObjects = groups.map(group => {
        return {
          year: course.year,
          division: course.division,
          group: group.courseGroup
        };
      });

      return groupsObjects;
    } catch (error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
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

  static async update ({CUIL, input}) {
    {
      const {
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
        await db.promise().execute('UPDATE Personal_Information SET DNI = ?, first_name = ?, second_name = ?, last_name1 = ?, last_name2 = ?, phone_number = ?, landline_phone_number = ?, direction = ? WHERE CUIL = ?', [DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction, CUIL]);
      } catch(e) {
        console.log(e);
        throw new Error('Error updating personal information');
      }

      try {
        await db.promise().execute('UPDATE Student_Information SET blood_type = ?, social_work = ? WHERE CUIL = ?', [blood_type, social_work, CUIL]);
      } catch (e) {
        console.log(e);
        throw new Error('Error updating student information');
      }
    };
  };
};
