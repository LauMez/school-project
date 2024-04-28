import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors'
import { exepleRouter } from './routes/route1'

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')


const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
})