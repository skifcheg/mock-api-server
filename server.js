//  http://localhost:4000/api/login  =>  jsons/login.json 

var path = require('path');
var http = require('http');
var express = require('express');
var WebSocket = require( "ws");
var fs = require('fs');
var app = express();
var port = 4000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });


const readFiles = (dirname, onFileContent, onError) => {
    console.log('dirname', dirname)
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        onError(err);
        return;
      }
      filenames.forEach(filename => {
        fs.readFile(dirname + filename, 'utf-8', (err, content) => {
          if (err) {
            onError(err);
            return;
          }
          onFileContent(filename, content);
        });
      });
    });
  }

// api 

app.get('/api/:json', (req, res) => {
    var options = {
        root: path.join(__dirname, 'jsons'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }    
    var fileName = req.params.json

    res.sendFile(fileName + '.json', options, function (err) {
        if (err) {
            console.log(err.status)
        } else {
            console.log('Sent:', fileName)
        }
    })
})



// WebSockets

wss.on('connection', (ws, data) => {
    ws.send('WebSocket server starting...');
    var i = 0;
    items = Object.entries(data).sort();
    setInterval(() => {
        if(i < items.length) { 
            console.log(items[i][0])
            ws.send(items[i][1]); i++; 
        } 
        else { i = 0;  } 
    }, 15000);
  
});

server.on('upgrade', (request, socket, head) => {
    const pathname = request.url;
    const data = {};
    readFiles(`.${pathname}`, 
        (filename, content) => { data[filename] = content }, 
        (err) => { console.log(err); throw err; }
    );
    wss.handleUpgrade(request, socket, head, ws => {
        setTimeout(() => { wss.emit('connection', ws, data) }, 1000)
    });
  });




// proxy

// app.set('trust proxy', function (ip) {
//     if (ip === '127.0.0.1' || ip === '123.123.123.123') return true; // trusted IPs
//     else return false;
// });


// server listener

server.listen(port, () => {
    console.log(`app listening at ${server.address().port}`)
})
