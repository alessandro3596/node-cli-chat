const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', onConnection);

const clients = new Set();

function onConnection(ws) {
  console.log('New Client Connected');

  clients.add(ws);
  
  ws.send(
    JSON.stringify({
      t: 1, // message
      d: {
        t: 0, // local
        d: 'welcome to the chat! please be nice!', // data
        s: +new Date() // timestamp
      }
    })
  );
  
  ws.on('message', () => onMessage(data, ws));
  ws.on('error', (err) => onError(err, ws));
  ws.on('close', () => onClose(ws));
}

onMessage(data, ws) {
  data = JSON.parse(data);

  const type = data.t;

  switch(type) {
    case 0: // ping
      ws.send(
        JSON.stringify({
          t: 0,
          d: +new Date()
        })
      );
      break;
    case 1: // message
      clients.forEach((ws) => {
        ws.send(
          JSON.stringify({
            t: 1,
            d: {
              t: 1, // message
              d: data.d,
              s: +new Date()
            }
          })
        );
      });
      break;
  }
}

function onClose(ws) {
  console.log('Client disconnected');
  clients.has(ws) && clients.delete(ws);

  clients.forEach((ws) => {
    ws.send(
      JSON.stringify({
        t: 2, // close
        s: +new Date()
      })
    );
  });
}

function onError(err, ws) => {
  console.log(err);
  clients.has(ws) && clients.delete(ws); // I'm not quite sure how these event listeners work...
}












