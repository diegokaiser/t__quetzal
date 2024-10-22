import express, { json } from 'express'
import { router } from './routes/printers.js'
import { corsMiddleware }  from './middlewares/cors.js'

const app = express()
app.use(express.json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/printers', router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT} •͡˘㇁•͡˘`);
})
