const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000
const cors = require ('cors')
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const qrcode = require('qrcode-terminal');



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const appRoute = require('./router');
const { bot } = require('./bot-wa/bot')
app.use('/', appRoute)

bot.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

bot.on('authenticated', () => {
  console.log("success")
});
bot.initialize();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})