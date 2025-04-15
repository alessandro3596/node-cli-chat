#!/usr/bin/node

const WebSocket = require('ws');

let address = 'ws://localhost:8080';

if(process.argv[1]) {
  address = process.argv[1];
}

let webSocket;

function connect() {
  webSocket = new WebSocket(address);

  webSocket.on('open', onOpen);
  webSocket.on('close', onClose);
  webSocket.on('error', onError);
  webSocket.on('message', onMessage);
}

function onOpen() {
  webSocket.send(
    JSON.stringify({
      t: 0,
      d: +new Date()
    })
  );
}

function onClose() {
  console.log('disconnected.');
  setTimeout(connect, 1e3);
}

function onError(err) {
  console.error(err);
}

function onMessage(data) {
  data = JSON.parse(data.toString());

  switch(data.t) {
    case 1: // ignore pong responses
      console.log(data.d.d);
      break;
  }
}
