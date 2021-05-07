const fs = require('fs');
const WebSocket = require( "ws");
const WS_INTERVAL = 15000;

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

const readFiles = (dirname, onFileContent, onError) => {
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

  wss.on('connection', (ws, data) => {
    ws.send('WebSocket server starting...');
    var i = 0;
    items = Object.entries(data).sort();
    setInterval(() => {
        if(i < items.length) { 
            ws.send(items[i][1]); i++; 
        } 
        else { i = 0;  } 
    }, WS_INTERVAL);
});


module.exports = (request, socket, head) => {
    console.log('WebSocket server starting... ', request.headers.host);
    const pathname = request.url;
    const data = {};
    readFiles(`.${pathname}`, 
        (filename, content) => { data[filename] = content }, 
        (err) => { console.log(err); throw err; }
    );
    wss.handleUpgrade(request, socket, head, ws => {
        setTimeout(() => { wss.emit('connection', ws, data) }, 1000)
    });
  }