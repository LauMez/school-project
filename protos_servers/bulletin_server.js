import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import mysql from 'mysql2'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bulletinDB'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const packageDefinition = protoLoader.loadSync('../protos/bulletin.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const bulletinservice = grpc.loadPackageDefinition(packageDefinition).bulletinservice;

const server = new grpc.Server();
const db = mysql.createConnection(connectionString)

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});
server.addService(bulletinservice.BulletinService.service, {
  GetAll: async (call, callback) => {
    try {
      const bulletins = await new Promise((resolve, reject) => {
        db.query('SELECT bulletinID FROM Bulletin', (err, bulletins) => {
          if (err) reject(err);
          resolve(bulletins);
        });
      });

      if (bulletins.length === 0) {
        console.error('Bulletins not found');
        call.end()
        return;
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
            call.emit('error', { code: grpc.status.NOT_FOUND, message: "Periods not found" });
            return;
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
          call.emit('error', { code: grpc.status.INTERNAL, details: "Internal error" });
        }
      });

      const bulletinObjects = await Promise.all(bulletinPromises);
      bulletinObjects.forEach(bulletinObject => call.write(bulletinObject));
      call.end();
    } catch (error) {
      console.error('Error processing course:', error);
      call.emit('error', { code: grpc.status.INTERNAL, details: "Internal error" });
    }
  }, 
  GetByID: async(call, callback) => {
    const { bulletinID } = call.request;

    try {
      const periods = await new Promise((resolve, reject) => {
        db.query('SELECT periodID FROM Period WHERE bulletinID = ?', [bulletinID], (err, bulletins) => {
          if (err) reject(err);
          resolve(bulletins);
        });
      });

      if (periods.length === 0) {
        console.error('Periods not found with ID: ', bulletinID);
        callback(null, periods);
      }
  
      const periodPromises = periods.map(async (period) => {
        const [pedagogicalAssessment] = await db.promise().execute('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [period.periodID]);
  
        const [assessment] = await db.promise().execute('SELECT qualification FROM Assessment WHERE assessmentID = ?', [pedagogicalAssessment[0].assessmentID]);
  
        return assessment[0].qualification;
      })
  
      const periodObjects = await Promise.all(periodPromises);
  
      callback(null, { firstAdvanceNote: periodObjects[0], firstPeriodNote: periodObjects[1], secondAdvanceNote: periodObjects[2], secondPeriodNote: periodObjects[3] });
    } catch {
      console.error('Error processing courses:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    }
  }
});

const port = '50054';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});