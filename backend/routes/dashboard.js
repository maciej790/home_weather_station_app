const express = require('express');
const router = express.Router();

router.post('/sensor_data', (req, res) => {
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
        console.log(message)
      }
    });
  }

  res.json({ message: 'Data received and broadcasted', receivedData: data });
});

module.exports = router;
