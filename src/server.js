const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000
const cors = require ('cors')
const aksesbot = require('./bot-wa/bot-handler')




app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const appRoute = require('./router');
const { botsession,bot } = require('./bot-wa/bot')
app.use('/', appRoute)
app.set('view engine','ejs')

botsession()
aksesbot

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})