import { Router } from 'express'
import { PrinterController } from '../controllers/printer.js'

export const router = Router()

router.post('/', PrinterController.print)
