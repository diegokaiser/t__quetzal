import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'https://quetzal-zeta.vercel.app/',
  'https://t-xochilt.vercel.app/',
  'http://192.168.1.39:3000'
]

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  }
})
