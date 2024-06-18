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
            const [Course] = await db.promise().execute('SELECT year, division FROM Course WHERE courseID = ?', [courseID]);
      
            const course = Course[0];
      
            if (!course) {
              console.error('Course not found with ID:', courseID);
              return [];
            };
      
            const groups = await new Promise((resolve, reject) => {
              db.query('SELECT courseGroup FROM Course_Group WHERE courseID = ?', [courseID], (err, groups) => {
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
      
            // groupsObjects.forEach(groupsObject => call.write(groupsObject));
            return groupsObjects;
        } catch (error) {
            console.error('Error processing course:', error);
            throw new Error('Internal server error');
        };
    };
};
