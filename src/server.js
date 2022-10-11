const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000
const cors = require ('cors')
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const appRoute = require('./router');
const { report } = require('./router')
app.use('/', appRoute,expressCspHeader({
  directives: {
    'script-src': [SELF]
  }
})).set('Access-Control-Allow-Origin', '*')
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})