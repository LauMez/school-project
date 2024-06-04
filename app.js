import express, { json } from 'express'
// import { createStudentRouter } from './routes/student.js'
import { createBulletinRouter } from './routes/bulletin.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import axios from 'axios'

// después
export const createApp = ({ studentModel, bulletinModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // app.use('/student', createStudentRouter({ studentModel }))
  app.use('/bulletin', createBulletinRouter({ bulletinModel }))

  // app.get('/', async (req, res) => {
  //   const response = await axios.get('http://localhost:1234/student')
  //   const students = response.data
  //   res.render('index', {students});
  // });
  // app.get('/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const response = await axios.get(`http://localhost:1234/student/${id}`)
  //   const students = response.data
  //   console.log(students)
  //   res.render('index', {students});
  // })

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
