const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000
const cors = require ('cors')
const aksesbot = require('./bot-wa/bot-handler')
const cron = require('node-cron');
const qrcode = require('qrcode');
//const qr = require('qrcode-terminal');
const http = require('http')
const server = http.createServer(app)
const {Server} = require("socket.io")
const io = new Server(server,{
  cors: {
    origin : "*"
  }
})





app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const appRoute = require('./router');
const {bot} = require('./bot-wa/bot')
app.use('/', appRoute)


var today  = new Date();
var now = today.toLocaleString();

bot.initialize()

io.on('connection', (socket) => {
  socket.emit('message', `${now} Connected`);

  bot.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      console.log(qr)
      socket.emit("qr", url);
      socket.emit('message', `${now} QR Code received`);
    });
  });

  bot.on('ready', () => {
    socket.emit('message', `${now} WhatsApp is ready!`);
    console.log('ready boi')

  });

  bot.on('authenticated', (session) => {
    socket.emit('message', `${now} Whatsapp is authenticated!`);
  });

  bot.on('auth_failure', function(session) {
    socket.emit('message', `${now} Auth failure, restarting...`);
  });

  bot.on('disconnected', function() {
    socket.emit('message', `${now} Disconnected`);
      bot.destroy();
      bot.initialize();
   
  });
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app