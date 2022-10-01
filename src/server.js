const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const appRoute = require('./router');
app.use('/', appRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})