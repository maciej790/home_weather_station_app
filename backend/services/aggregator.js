const { buffer } = require('../middleware/bufferMiddleware');
const { insertSensorData } = require('../db/saveReadings');
const { getLocalTimestampForMySQL } = require('../utils/timestamp');

function startAggregation() {
  setInterval(async () => {
    if (buffer.length === 0) return;

    try {
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
        air_pressure: (press / count).toFixed(2),
        air_quality: (air / count).toFixed(2),
        timestamp: getLocalTimestampForMySQL()
      };

      await insertSensorData(aggregated);

      buffer.length = 0; // reset
    } catch (err) {
      console.error("❌ Błąd agregacji:", err.message);
    }

  }, 60_000);
}

module.exports = startAggregation;
