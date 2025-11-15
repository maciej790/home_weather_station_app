function historyQueryMiddleware(req, res, next) {
  const { range, from, to, type } = req.query;

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

  // ------ PRESET RANGE ------
  if (range) {
    const interval = presets[range];
    if (!interval) {
      return res.status(400).json({ error: "Invalid range" });
    }

    sql = `
      SELECT ${column} 
      FROM sensor_readings 
      WHERE reading_at >= NOW() - INTERVAL ${interval}
      ORDER BY reading_at DESC
    `;

    req.historyQuery = { sql, params };
    return next();
  }

  // ------ CUSTOM RANGE ------
  if (from && to) {
    sql = `
      SELECT ${column}
      FROM sensor_readings
      WHERE reading_at BETWEEN ? AND ?
      ORDER BY reading_at DESC
    `;

    params = [from, to];
    req.historyQuery = { sql, params };
    return next();
  }

  // ------ NO FILTERS → GET ALL ------
  sql = `
    SELECT ${column}
    FROM sensor_readings
    ORDER BY reading_at DESC
  `;

  req.historyQuery = { sql, params };
  return next();
}

module.exports = {
  historyQueryMiddleware
};
