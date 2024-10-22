import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'https://t-xochilt.vercel.app',
  'http://192.168.1.39:8080',
  'http://localhost:8080',
  'http://192.168.1.39:3000',
  'http://localhost:3000'
]

export const corsMiddleware  = ({ acceptedOrigings = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigings.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})
