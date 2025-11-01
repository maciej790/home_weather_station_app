const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Dashboard Home');
});

router.post('/sensor_data', (req, res) => {
  const data = req.body;
 // console.log('📡 Otrzymano dane z ESP32:', data);

  const wss = req.app.get('wss');

  if (wss) {
    const message = JSON.stringify({
      type: 'sensor_update',
      timestamp: new Date().toISOString(),
      payload: data
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }

  res.json({ message: 'Data received and broadcasted', receivedData: data });
});

module.exports = router;
