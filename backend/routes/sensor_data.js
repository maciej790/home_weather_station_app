const express = require('express');
const router = express.Router();
const { bufferMiddleware } = require('../middleware/bufferMiddleware');
const { getLocalTimestampForMySQL } = require('../utils/timestamp');

router.post('/', (req, res) => {
  const data = req.body;
  const wss = req.app.get('wss');

  if (!data) {
    return res.status(400).json({ error: 'No data received' });
  }

  if (wss) {
    const message = JSON.stringify({
      type: 'sensor_update',
      timestamp: getLocalTimestampForMySQL(),
      payload: data
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(message);
    });
  }

  res.json({ 
    message: 'Data received and broadcasted', 
    receivedData: data 
  });
});

router.post('/store_data', bufferMiddleware, (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ error: 'No data received' });
  }

  res.status(200).json({
    message: 'Data stored successfully',
    storedData: data,
    time: getLocalTimestampForMySQL()
  });
});


module.exports = router;
