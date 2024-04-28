import cors from 'cors'

const ACCPETED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:1234'
]

export const corsMiddleware = ({ acceptedOrigins = ACCPETED_ORIGINS} = {}) => cors ({
    origin: (origin, callback) => {
        if(ACCPETED_ORIGINS.includes(origin)) return callback(null, true)

        if(!origin) return callback(null, true)

        return callback(new Error('Not allowed by CORS'))
    }
})