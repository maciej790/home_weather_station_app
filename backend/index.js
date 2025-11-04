const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const dashboard = require('./routes/dashboard');

const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.use('/dashboard', dashboard);

// Server + WebSocket
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

// Ustawiamy dostęp do WebSocketa w app
app.set('wss', wss);

// Prosty test endpoint
app.get('/', (_, res) => res.send('Serwer działa!'));

server.listen(port, () => console.log(`🚀 App listening on port ${port}!`));
