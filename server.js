//  http://localhost:4000/api/login  =>  jsons/login.json 
//  ws://localhost:4000/ws/SW  =>  ws/SW/0.json, ws/SW/1.json, ws/SW/2.json, ws/SW/3.json 

const http = require('http');
const app = require('express')();
const REST = require('./setting/rest');
const WS = require('./setting/ws');
const PORT = 4000;

const server = http.createServer(app);

// API
app.use('/api', REST);

// WebSockets
server.on('upgrade', WS);

// proxy

// app.set('trust proxy', function (ip) {
//     if (ip === '127.0.0.1' || ip === '123.123.123.123') return true; // trusted IPs
//     else return false;
// });


// server listener

server.listen(PORT, () => {
    console.log(`app listening at ${server.address().port}`)
})
