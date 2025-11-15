const express = require('express');
const router = express.Router();
const { historyQueryMiddleware } = require('../middleware/historyQueryMiddleware');
const db = require('../db/connect'); // Twój moduł z mysql2

router.get('/', historyQueryMiddleware, async (req, res) => {
  try {
    const { sql, params } = req.historyQuery;

    // Limit: ?limit=50
    const limit = parseInt(req.query.limit) || 50; // domyślnie 50 wierszy

    // dodanie LIMIT do SQL
    const limitedSql = `${sql} LIMIT ?`;
    const limitedParams = [...params, limit];

    const [rows] = await db.execute(limitedSql, limitedParams);

    res.json({
      limit,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error("❌ Błąd pobierania danych historycznych:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;
