// middleware/historyQueryMiddleware.js
const allowed = {
  temperature: "temperature",
  humidity: "humidity",
  pressure: "air_pressure",
  air_quality: "air_quality"
};

const presets = {
  "1h": "1 HOUR",
  "24h": "1 DAY",
  "7d": "7 DAY",
  "1m": "1 MONTH",
  "1y": "1 YEAR"
};

function historyQueryMiddleware(req, res, next) {
  const { range, from, to, type, isChart } = req.query;

  // wybrane kolumny do agregacji
  const selectedColumns = type && allowed[type] ? [allowed[type]] : Object.values(allowed);

  // funkcja generująca SQL do wykresu (średnie wartości)
  function buildChartSQL(columns, where, intervalBucket) {
    const avgColumns = columns.map(col => `ROUND(AVG(${col}),2) AS ${col}`).join(', ');
    return `
      SELECT 
        ${avgColumns},
        DATE_FORMAT(reading_at, '${intervalBucket}') AS reading_at
      FROM sensor_readings
      ${where}
      GROUP BY DATE_FORMAT(reading_at, '${intervalBucket}')
      ORDER BY reading_at ASC
    `;
  }

  let sql = "";
  let params = [];

  // ===============================
  //            RANGE
  // ===============================
  if (range) {
    const interval = presets[range];
    if (!interval) return res.status(400).json({ error: "Invalid range" });

    if (isChart === 'true') {
      // bucket zależny od zakresu
      let bucket = "%Y-%m-%d %H:00:00";
      if (range === "1h") bucket = "%Y-%m-%d %H:%i:00";
      if (range === "24h") bucket = "%Y-%m-%d %H:00:00";
      if (range === "7d" || range === "1m") bucket = "%Y-%m-%d";
      if (range === "1y") bucket = "%Y-%m";

      sql = buildChartSQL(selectedColumns, `WHERE reading_at >= NOW() - INTERVAL ${interval}`, bucket);
    } else {
      sql = `SELECT ${selectedColumns.join(',')}, reading_at 
             FROM sensor_readings 
             WHERE reading_at >= NOW() - INTERVAL ${interval}
             ORDER BY reading_at DESC`;
    }

    req.historyQuery = { sql, params };
    return next();
  }

  // ===============================
  //      CUSTOM DATE RANGE
  // ===============================
  if (from && to) {
    const diffDays = (new Date(to) - new Date(from)) / (1000 * 3600 * 24);

    if (isChart === 'true') {
      let bucket = "%Y-%m-%d";
      if (diffDays <= 1) bucket = "%Y-%m-%d %H:00:00";
      else if (diffDays <= 30) bucket = "%Y-%m-%d";
      else if (diffDays <= 365) bucket = "%Y-%m";

      sql = buildChartSQL(selectedColumns, "WHERE reading_at BETWEEN ? AND ?", bucket);
      params = [from, to];
    } else {
      sql = `SELECT ${selectedColumns.join(',')}, reading_at
             FROM sensor_readings
             WHERE reading_at BETWEEN ? AND ?
             ORDER BY reading_at DESC`;
      params = [from, to];
    }

    req.historyQuery = { sql, params };
    return next();
  }

  // ===============================
  //      ALL DATA
  // ===============================
  if (isChart === 'true') {
    sql = buildChartSQL(selectedColumns, "", "%Y-%m-%d");
    req.historyQuery = { sql, params };
    return next();
  }

  // tabelka (bez wykresu)
  sql = `SELECT ${selectedColumns.join(',')}, reading_at
         FROM sensor_readings
         ORDER BY reading_at DESC`;

  req.historyQuery = { sql, params };
  next();
}

// ------------------------------
// Funkcja konwertująca daty na polski czas i zaokrąglająca wartości
// ------------------------------
function convertDatesToPolishTime(rows) {
  return rows.map(row => {
    const newRow = { ...row };
    newRow.reading_at = new Date(newRow.reading_at).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });
    Object.keys(allowed).forEach(key => {
      if (newRow[key] !== undefined && newRow[key] !== null) {
        newRow[key] = Number(newRow[key].toFixed(2));
      }
    });
    return newRow;
  });
}

module.exports = { historyQueryMiddleware, convertDatesToPolishTime };
