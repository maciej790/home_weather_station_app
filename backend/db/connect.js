const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'home_weather_station_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+01:00' // ustawiamy strefę czasową na Polskę
});

module.exports = db;
