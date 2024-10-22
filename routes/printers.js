import { Router } from 'express'
import { PrinterController } from '../controllers/printer.js'

export const router = Router()

router.get('/', PrinterController.test)
router.post('/', PrinterController.print)
