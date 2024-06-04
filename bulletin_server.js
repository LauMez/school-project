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

const packageDefinition = protoLoader.loadSync('bulletin.proto', {
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
    GetBulletin: (call, callback) => {
    const { CUIL } = call.request;
    db.query('SELECT bulletinID FROM Bulletin WHERE CUIL = ?', [CUIL], (err, bulletin) => {
        const bulletinID = bulletin[0].bulletinID
        console.log('BulletinID: ', bulletinID);
        if (!bulletinID) {
            callback({ code: grpc.status.INTERNAL, details: "Internal error" });
        } 
        // else {
        //     callback(null, {details: 'Nashe'});
        // }
        db.query('SELECT periodID FROM First_Advance WHERE bulletinID = ?', [bulletinID], (err, firstAdvance) => {
            const periodID = firstAdvance[0].periodID
            console.log('PeriodID: ', periodID)
            if (!periodID) {
                callback({ code: grpc.status.INTERNAL, details: "Internal error" });
            }

            db.query('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [periodID], (err, FAPedagogicalAssessment) => {
                const assessmentID = FAPedagogicalAssessment[0].assessmentID
                console.log('AssessmentID: ', assessmentID)
                if (!assessmentID) {
                    callback({ code: grpc.status.INTERNAL, details: "Internal error" });
                }

                db.query('SELECT qualification FROM Assessment WHERE assessmentID = ?', [assessmentID], (err, FAAssessment) => {
                    const firstAdvanceNote = FAAssessment[0].qualification
                    console.log('Firs Advance Note: ', firstAdvanceNote)
                    if (!firstAdvanceNote) {
                        callback({ code: grpc.status.INTERNAL, details: "Internal error" });
                    }

                    //Error aca
                    callback(null, {firstAdvanceNote: firstAdvanceNote});
                })
            })
        })

        db.query('SELECT periodID FROM First_Period WHERE bulletinID = ?', [bulletinID], (err, firstPeriod) => {
            const periodID = firstPeriod[0].periodID
            console.log('PeriodID: ', periodID)
            if (!periodID) {
                callback({ code: grpc.status.INTERNAL, details: "Internal error" });
            }

            db.query('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [periodID], (err, FPPedagogicalAssessment) => {
                const assessmentID = FPPedagogicalAssessment[0].assessmentID
                console.log('AssessmentID: ', assessmentID)
                if (!assessmentID) {
                    callback({ code: grpc.status.INTERNAL, details: "Internal error" });
                }

                db.query('SELECT qualification FROM Assessment WHERE assessmentID = ?', [assessmentID], (err, FPAssessment) => {
                    const firstPeriodNote = FPAssessment[0].qualification
                    console.log('Firs Period Note: ', firstPeriodNote)
                    if (!firstPeriodNote) {
                        callback({ code: grpc.status.INTERNAL, details: "Internal error" });
                    }

                    callback(null, {firstPeriodNote: firstPeriodNote});
                })
            })
        })
    });
      
      
    //   if (row) {
    //     callback(null, {details: 'Nashe'});
    //   } else {
    //     callback({ code: grpc.status.NOT_FOUND, details: "Bulletin not found" });
    //   }
  }
});

const port = '50051';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});