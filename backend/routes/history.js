const express = require('express');
const router = express.Router();
const { historyQueryMiddleware, convertDatesToPolishTime } = require('../middleware/historyQueryMiddleware');
const db = require('../db/connect');

router.get('/', historyQueryMiddleware, async (req, res) => {
  try {
    const { sql, params } = req.historyQuery;

    // Sprawdzamy, czy podano page i limit
    const pageProvided = req.query.page !== undefined;
    const limitProvided = req.query.limit !== undefined;

    let rows, total, pages, count;

    if (!pageProvided && !limitProvided) {
      // Jeśli brak paginacji, pobieramy wszystkie rekordy
      [rows] = await db.execute(sql, params);
      const convertedRows = convertDatesToPolishTime(rows);
      total = convertedRows.length;
      pages = 1;
      count = total;

      res.json({
        page: 1,
        limit: total,
        total,
        pages,
        count,
        data: convertedRows
      });
      return;
    }

    // Jeśli są podane page/limit, stosujemy paginację
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const countSql = `SELECT COUNT(*) AS total FROM (${sql}) AS sub`;
    const [countRows] = await db.execute(countSql, params);
    total = countRows[0].total;

    const paginatedSql = `${sql} LIMIT ? OFFSET ?`;
    const paginatedParams = [...params, limit, offset];
    [rows] = await db.execute(paginatedSql, paginatedParams);

    const convertedRows = convertDatesToPolishTime(rows);
    count = convertedRows.length;

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      count,
      data: convertedRows
    });

  } catch (err) {
    console.error("❌ Błąd pobierania danych historycznych:", err.message);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;