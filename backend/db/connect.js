const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'home_weather_station_app',
});

db.connect(err => {
  if (err) {
    console.error('❌ Błąd połączenia z MySQL:', err.message);
  } 
});

module.exports = db;