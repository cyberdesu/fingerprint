const fs = require('fs');
const { resolve } = require('path');

const app = require('../server')
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const { Client, LocalAuth,LegacySessionAuth } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const bot = new Client({
    authStrategy: new LocalAuth({
    }),
    restartOnAuthFail: true,
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        //'--single-process', // <- this one doesn't works in Windows
        '--disable-gpu'
      ],
    },
});

module.exports = {bot}