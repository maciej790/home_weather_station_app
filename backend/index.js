const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const sensor_data = require('./routes/sensor_data');
const history = require('./routes/history');
const norm = require('./routes/norm');
const startAggregation = require('./services/aggregator');
const auth = require('./routes/auth');

const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(bodyParser.json())
// app.use(bufferMiddleware);


// Routes
app.use('/sensor_data', sensor_data);
app.use('/history', history);
app.use('/norm', norm);
app.use('/auth', auth);

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

startAggregation()

// Prosty test endpoint
app.get('/', (_, res) => res.send('Serwer działa!'));

server.listen(port, () => console.log(`🚀 App listening on port ${port}!`));
