const express = require('express')
const escpos = require('escpos');
const cors = require('cors')
escpos.USB = require('escpos-usb');

const app = express()
app.use(cors())
app.use(express.json())
app.disable('x-powered-by')

app.get('/printers', (req, res) => {
  res.send(":)")
})

app.get('/printers/list', (req, res) => {
  const printer = escpos.USB.findPrinter()
  const deviceDescriptor = printer[0].deviceDescriptor
  const idVendor = deviceDescriptor.idVendor
  const idProduct = deviceDescriptor.idProduct
  res.send(`${idVendor}, ${idProduct}`)
})

app.post('/printers', (req, res) => {
  console.log(req)
  const { print } = req.body


  if ( !print || !print.template ) {
    return res.status(400).json({
      error: 'El objeto print y template son requeridos'
    })
  }

  const { template } = print

  try {
    const device = new escpos.USB()
    const printer = new escpos.Printer(device)

    device.open((error) => {
      if (error) {
        return res.status(500).json({
          error: 'Error al conectar con la impresora'
        })
      }

      printer.text(template.header)
      template.items.forEach(item => {
        printer.tableCustom([
          { text: item.quantity, align: 'LEFT', width: 0.1 },
          { text: item.description, align: 'CENTER', width: 0.5 },
          { text: item.unitPrice, align: 'RIGHT', width: 0.2 },
          { text: item.totalPrice, align: 'RIGHT', width: 0.2 }
        ])
      })
      printer.text(template.footer)
      printer.cut()
      printer.close()
      
      res.status(200).json({
        message: 'Ticket enviado a la impresora'
      })
    })

  } catch (error) {
    console.error('Error al imprimir', error)
    res.status(500).json({
      error: 'Error al imprimir'
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT} •͡˘㇁•͡˘`)
})
