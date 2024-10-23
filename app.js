const express = require('express')
const escpos = require('escpos');
escpos.USB = require('escpos-usb')
const cors = require('cors')

const device = new escpos.USB()
const printer = new escpos.Printer(device)

var bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.disable('x-powered-by')

app.get('/printers', (req, res) => {
  res.send(":)")
})

app.get('/printers/list', (req, res) => {
  res.json(
    { status: 'success' }
  )
  device.open(function () {
    printer
      .font('a')
      .align('lt')
      .style('b')
      .size(1)
      .text("FECHA: 04/10/2024")
      .text("MESA: Mesa 11")
      .text("CAMARERO: Liderman")
      .tableCustom(
        [
          { text: "CANT", align: 'LEFT', width: 0.1 },
          { text: "DESC", align: 'CENTER', width: 0.5 },
          { text: "P.UNIT", align: 'RIGHT', width: 0.2 },
          { text: "P.TOTAL", align: 'RIGHT', width: 0.2 },
        ]
      )
      .tableCustom(
        [
          { text: "1", align: 'LEFT', width: 0.1 },
          { text: "Quesadilla Pibil", align: 'CENTER', width: 0.5 },
          { text: "10.90", align: 'RIGHT', width: 0.2 },
          { text: "10.90", align: 'RIGHT', width: 0.2 },
        ]
      )
      .tableCustom(
        [
          { text: "TOTAL: 31.80"}
        ],
        { size: [1, 1]}
      )
      .text("")
      .text("")
      .text("")
      .cut()
      .close();
  });
})

app.post('/printers', (req, res) => {
  const { print } = req.body

  if ( !print || !print.template ) {
    return res.status(400).json({
      code: 400,
      message: 'El objeto print y template son requeridos'
    })
  }

  const { template } = print
  template.header.forEach((item) => {
    console.log(item.text)
  })
  try {
    device.open(function () {
      printer
        .font('a')
        .align('lt')
        .style('a')
        .size(1)

      template.header.forEach((item) => {
        printer.text(item.text)
      })

      printer
        .text("")
        .tableCustom(
          [
            { text: "CANT", align: 'LEFT', width: 0.1 },
            { text: "DESC", align: 'LEFT', width: 0.5 },
            { text: "P.UNIT", align: 'RIGHT', width: 0.2 },
            { text: "P.TOTAL", align: 'RIGHT', width: 0.2 },
          ]
        )

      template.items.forEach((item) => {
        const [quantityObj, descriptionObj, unitPriceObj, totalPriceObj] = item
        printer.tableCustom(
          [
            { text: quantityObj.quantity, align: 'LEFT', width: 0.1 },
            { text: descriptionObj.description, align: 'LEFT', width: 0.5 },
            { text: unitPriceObj.unitPrice, align: 'RIGHT', width: 0.2 },
            { text: totalPriceObj.totalPrice, align: 'RIGHT', width: 0.2 },
          ]
        )
      })
        
      printer
        .text("")
        .style('b')
        .size(1,1)
        .tableCustom(
          [
            { text: template.footer}
          ],
          { size: [1, 1]}
        )
        .text("")
        .text("")
        .cut()
        .close();
    });
  } catch (error) {
    console.error('Error al imprimir', error)
    res.status(500).json({
      code: 500,
      message: 'Error al imprimir'
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT} •͡˘㇁•͡˘`)
})