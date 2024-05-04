import express from 'express'
import logger from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'
import { createMovieRouter } from '../routes/movies.js'

// app.get('/', (req, res) => {
//     res.sendFile(process.cwd() + '/client/index.html')
// })

export const createApp = ({ movieModel }) => {
    const app = express()
    app.use(logger('dev'))
    app.use(json())
    app.use(corsMiddleware())
    app.disable('x-powered-by')
  
    app.use('/movies', createMovieRouter({ movieModel }))
  
    const PORT = process.env.PORT ?? 1234
  
    app.listen(PORT, () => {
      console.log(`server listening on port http://localhost:${PORT}`)
    })
}