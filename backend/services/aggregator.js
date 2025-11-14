const { buffer } = require('../middleware/bufferMiddleware');
const { insertSensorData } = require('../db/saveReadings');

function startAggregation() {
  setInterval(() => {
    if (buffer.length === 0) return;

    let temp = 0, hum = 0, press = 0, air = 0;

    buffer.forEach(d => {
      temp += d.temperature || 0;
      hum += d.humidity || 0;
      press += d.pressure || 0;
      air += d.voltage || 0;
    });

    const count = buffer.length;

    const aggregated = {
      temperature: (temp / count).toFixed(2),
      humidity: (hum / count).toFixed(2),
      pressure: (press / count).toFixed(2),
      air_quality: (air / count).toFixed(2),
      timestamp: new Date().toISOString() + 1
    };

    // here store data to db
    insertSensorData(aggregated)
      .then(() => {
        console.log('✅ Zapisano zagregowane dane do bazy:', aggregated);
      })
      .catch(err => {
        console.error('❌ Błąd zapisu zagregowanych danych:', err.message);
      });

    // reset
    buffer.length = 0;

  }, 60000);
}

module.exports = startAggregation;
