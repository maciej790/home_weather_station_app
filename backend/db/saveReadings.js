const db = require('./connect');

async function insertSensorData(data) {
  const query = `
    INSERT INTO sensor_readings (temperature, humidity, air_pressure, air_quality, reading_at)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    data.temperature,
    data.humidity,
    data.air_pressure,
    data.air_quality,
    data.timestamp
  ];

  try {
    const [result] = await db.execute(query, values);
    return result;
  } catch (err) {
    console.error("❌ Błąd zapisu danych:", err.message);
    throw err;
  }
}

module.exports = { insertSensorData };
