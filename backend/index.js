const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const dashboard = require('./routes/dashboard');

const app = express();
const port = 3000;

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(bodyParser.json());
app.use('/dashboard', dashboard);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('💡 Nowe połączenie WebSocket');

  ws.send(JSON.stringify({ type: 'welcome', message: 'Połączono z serwerem WebSocket!' }));

  ws.on('message', (msg) => {
    console.log('📨 Otrzymano od klienta:', msg.toString());
  });

  ws.on('close', () => {
    console.log('❌ Klient WebSocket rozłączony');
  });
});

app.set('wss', wss);

server.listen(port, () => console.log(`🚀 App listening on port ${port}!`));
