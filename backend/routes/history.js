// routes/history.js
const express = require('express');
const router = express.Router();
const { historyQueryMiddleware, convertDatesToPolishTime } = require('../middleware/historyQueryMiddleware');
const db = require('../db/connect');

router.get('/', historyQueryMiddleware, async (req, res) => {
  try {
    const { sql, params } = req.historyQuery;

    // Wykres lub brak paginacji -> pobieramy wszystkie rekordy
    if (req.query.isChart === 'true' || (req.query.page === undefined && req.query.limit === undefined)) {
      const [rows] = await db.execute(sql, params);
      const convertedRows = convertDatesToPolishTime(rows);
      return res.json({
        page: 1,
        limit: convertedRows.length,
        total: convertedRows.length,
        pages: 1,
        count: convertedRows.length,
        data: convertedRows
      });
    }

    // ===============================
    // Paginated table data
    // ===============================
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const countSql = `SELECT COUNT(*) AS total FROM (${sql}) AS sub`;
    const [countRows] = await db.execute(countSql, params);
    const total = countRows[0].total;

    const paginatedSql = `${sql} LIMIT ? OFFSET ?`;
    const paginatedParams = [...params, limit, offset];
    const [rows] = await db.execute(paginatedSql, paginatedParams);
    const convertedRows = convertDatesToPolishTime(rows);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      count: convertedRows.length,
      data: convertedRows
    });

  } catch (err) {
    console.error("❌ Błąd pobierania danych historycznych:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;
