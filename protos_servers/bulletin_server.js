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
    GetBulletin: (call, callback) => {
    const { CUIL } = call.request;

    (async () => {
        try {
            const [bulletin] = await db.promise().execute('SELECT bulletinID FROM Bulletin WHERE CUIL = ?', [CUIL]);
            const bulletinID = bulletin[0].bulletinID

            const [firstAdvance] = await db.promise().execute('SELECT periodID FROM First_Advance WHERE bulletinID = ?', [bulletinID])
            const FAperiodID = firstAdvance[0].periodID
            
            const [FApedagogicalAssessment] = await db.promise().execute('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [FAperiodID])
            const FAassessmentID = FApedagogicalAssessment[0].assessmentID

            const [FAassessment] = await db.promise().execute('SELECT qualification FROM Assessment WHERE assessmentID = ?', [FAassessmentID])
            const FirstAdvanceNote = FAassessment[0].qualification

            const [firstPeriod] = await db.promise().execute('SELECT periodID FROM First_Period WHERE bulletinID = ?', [bulletinID])
            const FPperiodID = firstPeriod[0].periodID
            
            const [FPpedagogicalAssessment] = await db.promise().execute('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [FPperiodID])
            const FPassessmentID = FPpedagogicalAssessment[0].assessmentID

            const [FPassessment] = await db.promise().execute('SELECT qualification FROM Assessment WHERE assessmentID = ?', [FPassessmentID])
            const FirstPeriodNote = FPassessment[0].qualification
            
            const [secondAdvance] = await db.promise().execute('SELECT periodID FROM Second_Advance WHERE bulletinID = ?', [bulletinID])
            const SAperiodID = secondAdvance[0].periodID
            
            const [SApedagogicalAssessment] = await db.promise().execute('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [SAperiodID])
            const SAassessmentID = SApedagogicalAssessment[0].assessmentID

            const [SAassessment] = await db.promise().execute('SELECT qualification FROM Assessment WHERE assessmentID = ?', [SAassessmentID])
            const SecondAdvanceNote = SAassessment[0].qualification

            const [secondPeriod] = await db.promise().execute('SELECT periodID FROM Second_Period WHERE bulletinID = ?', [bulletinID])
            const SPperiodID = secondPeriod[0].periodID
            
            const [SPpedagogicalAssessment] = await db.promise().execute('SELECT assessmentID FROM Pedagogical_Assessment WHERE periodID = ?', [SPperiodID])
            const SPassessmentID = SPpedagogicalAssessment[0].assessmentID

            const [SPassessment] = await db.promise().execute('SELECT qualification FROM Assessment WHERE assessmentID = ?', [SPassessmentID])
            const SecondPeriodNote = SPassessment[0].qualification
            
            callback(null, { firstAdvanceNote: FirstAdvanceNote, firstPeriodNote: FirstPeriodNote, secondAdvanceNote: SecondAdvanceNote, secondPeriodNote: SecondPeriodNote });
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            callback(error, null);
        }
    })()
      
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