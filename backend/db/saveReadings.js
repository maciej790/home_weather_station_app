const db = require('./connect'); // poprawiony import

function insertSensorData(data) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO sensor_readings (temperature, humidity, air_pressure, air_quality, reading_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      data.temperature,
      data.humidity,
      data.pressure,
      data.air_quality,
      data.timestamp
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('❌ Błąd podczas wstawiania danych do bazy:', err.message);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = { insertSensorData };
