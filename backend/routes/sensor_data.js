const express = require('express');
const router = express.Router();
const { bufferMiddleware } = require('../middleware/bufferMiddleware');

router.post('/', (req, res) => {
  const data = req.body;
  const wss = req.app.get('wss');

  if (!data) {
    return res.status(400).json({ error: 'No data received' });
  }

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

router.post('/store_data', bufferMiddleware, (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ error: 'No data received' });
  }


  // console.log(req.BUFFER_LIMIT)
  // // console.log('Storing sensor data:', data, new Date().toISOString());

  res.json({ message: 'Data stored successfully', storedData: data, time: new Date().toISOString() });
})

module.exports = router;
