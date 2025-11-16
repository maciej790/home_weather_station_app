function historyQueryMiddleware(req, res, next) {
  const { range, from, to, type, isChart } = req.query;

  const presets = {
    "1h": "1 HOUR",
    "24h": "1 DAY",
    "7d": "7 DAY",
    "1m": "1 MONTH",
    "1y": "1 YEAR"
  };

  const allowed = {
    temperature: "temperature",
    humidity: "humidity",
    pressure: "air_pressure",
    air_quality: "air_quality"
  };

  const column = type && allowed[type] ? `${allowed[type]}, reading_at` : "*";
  let sql = "";
  let params = [];

  const getAggregatedSQL = (columnName, interval) => {
    let timeBucket = "";

    switch (interval) {
      case "1 HOUR":
        timeBucket = "%Y-%m-%d %H:%i:00"; // średnia co minutę
        break;
      case "1 DAY":
        timeBucket = "%Y-%m-%d %H:00:00"; // średnia co godzinę
        break;
      case "1 MONTH":
        timeBucket = "%Y-%m-%d"; // średnia dzienna
        break;
      case "1 YEAR":
        timeBucket = "%Y-%m"; // średnia miesięczna
        break;
      default:
        timeBucket = "%Y-%m-%d %H:%i:%s"; // brak agregacji
    }

    return `
      SELECT
        ${columnName},
        DATE_FORMAT(reading_at, '${timeBucket}') as reading_at,
        AVG(${columnName}) as avg_value
      FROM sensor_readings
      WHERE reading_at >= NOW() - INTERVAL ${interval}
      GROUP BY DATE_FORMAT(reading_at, '${timeBucket}')
      ORDER BY reading_at ASC
    `;
  };

  // Obsługa presetów
  if (range) {
    const interval = presets[range];
    if (!interval) return res.status(400).json({ error: "Invalid range" });

    if (isChart && type && allowed[type]) {
      sql = getAggregatedSQL(allowed[type], interval);
    } else {
      sql = `
        SELECT ${column} 
        FROM sensor_readings 
        WHERE reading_at >= NOW() - INTERVAL ${interval}
        ORDER BY reading_at DESC
      `;
    }

    req.historyQuery = { sql, params };
    return next();
  }

  // Obsługa niestandardowego zakresu
  if (from && to) {
    const start = new Date(from);
    const end = new Date(to);
    const diffMs = end - start;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (isChart && type && allowed[type]) {
      let timeBucket = "%Y-%m-%d"; // domyślnie agregacja dzienna

      if (diffDays <= 1) timeBucket = "%Y-%m-%d %H:00:00";       // max 24 punkty
      else if (diffDays <= 30) timeBucket = "%Y-%m-%d";          // max 30 punktów
      else if (diffDays <= 365) timeBucket = "%Y-%m";            // max 12 punktów

      sql = `
        SELECT
          ${allowed[type]},
          DATE_FORMAT(reading_at, '${timeBucket}') as reading_at,
          AVG(${allowed[type]}) as avg_value
        FROM sensor_readings
        WHERE reading_at BETWEEN ? AND ?
        GROUP BY DATE_FORMAT(reading_at, '${timeBucket}')
        ORDER BY reading_at ASC
      `;
      params = [from, to];
    } else {
      sql = `
        SELECT ${column}
        FROM sensor_readings
        WHERE reading_at BETWEEN ? AND ?
        ORDER BY reading_at DESC
      `;
      params = [from, to];
    }

    req.historyQuery = { sql, params };
    return next();
  }

  // Brak filtrów → wszystkie dane
  sql = `
    SELECT ${column}
    FROM sensor_readings
    ORDER BY reading_at DESC
  `;
  req.historyQuery = { sql, params };
  return next();
}

function convertDatesToPolishTime(rows) {
  return rows.map(row => ({
    ...row,
    reading_at: new Date(row.reading_at).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
  }));
}

module.exports = {
  historyQueryMiddleware,
  convertDatesToPolishTime
};
