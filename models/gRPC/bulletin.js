import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bulletinDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const db = mysql.createConnection(connectionString)

db.connect(err => {
  if (err) {
    console.error('Bulletin database connection failed:', err.stack);
    return;
  };

  console.log('Connected to bulletin database.');
});
export class BulletinModel {
    static async getAll () {
        try {
            const bulletins = await new Promise((resolve, reject) => {
              db.query('SELECT bulletinID FROM Bulletin', (err, bulletins) => {
                if (err) reject(err);
      
                resolve(bulletins);
              });
            });
      
            if (bulletins.length === 0) {
              console.error('Bulletins not found');
              return [];
            }
      
            const bulletinPromises = bulletins.map(async (bulletin) => {
                try {
                    const periods = await new Promise((resolve, reject) => {
                    db.query('SELECT periodID FROM Period WHERE bulletinID = ?', [bulletin.bulletinID], (err, periods) => {
                        if (err) reject(err);
                        resolve(periods);
                    });
                    });
        
                    if (!periods) {
                    console.error('Periods not found');
                    return [];
                    }
        
                    const periodPromises = periods.map(async (period) => {
                    const [pedagogicalAssessment] = await db.promise().execute('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [period.periodID]);
        
                    const [assessment] = await db.promise().execute('SELECT qualification FROM Assessment WHERE assessmentID = ?', [pedagogicalAssessment[0].assessmentID]);
        
                    return assessment[0].qualification;
                    });
        
                    const periodObjects = await Promise.all(periodPromises);
        
                    return {
                    firstAdvanceNote: periodObjects[0],
                    firstPeriodNote: periodObjects[1],
                    secondAdvanceNote: periodObjects[2],
                    secondPeriodNote: periodObjects[3]
                    };
                } catch (error) {
                    console.error('Error processing course:', error);
                    throw new Error('Internal error');
                };
            });
      
            const bulletinObjects = await Promise.all(bulletinPromises);
            return bulletinObjects;
        } catch (error) {
            console.error('Error processing course:', error);
            throw new Error('Internal error');
        };
    };

    static async getByID ({ bulletinID }) {
        try {
            const periods = await new Promise((resolve, reject) => {
              db.query('SELECT periodID FROM Period WHERE bulletinID = ?', [bulletinID], (err, bulletins) => {
                if (err) reject(err);
                resolve(bulletins);
              });
            });
      
            if (periods.length === 0) {
              console.error('Periods not found with ID: ', bulletinID);
            return [];
            };
        
            const periodPromises = periods.map(async (period) => {
              const [pedagogicalAssessment] = await db.promise().execute('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [period.periodID]);
        
              const [assessment] = await db.promise().execute('SELECT qualification FROM Assessment WHERE assessmentID = ?', [pedagogicalAssessment[0].assessmentID]);
        
              return assessment[0].qualification;
            })
        
            const periodObjects = await Promise.all(periodPromises);
        
            return { 
                firstAdvanceNote: periodObjects[0], 
                firstPeriodNote: periodObjects[1], 
                secondAdvanceNote: periodObjects[2], 
                secondPeriodNote: periodObjects[3] 
            };
        } catch {
            console.error('Error processing courses:', error);
            throw new Error('Internal error');
        };
    };
};