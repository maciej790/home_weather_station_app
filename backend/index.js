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
const user = require('./routes/user')

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
app.use('/user', user)

// Server + WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected with web socket!' }));

  ws.on('message', (msg) => {
    console.log('Recived data:', msg.toString());
  });

  ws.on('close', () => {
    console.log('Client websocket was closed');
  });
});

// Ustawiamy dostęp do WebSocketa w app
app.set('wss', wss);

startAggregation()

// Prosty test endpoint
app.get('/', (_, res) => res.send('Serwer działa!'));

server.listen(port, () => console.log(`🚀 App listening on port ${port}!`));
