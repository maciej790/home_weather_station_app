const express = require('express');
const router = express.Router();
const db = require('../db/connect'); // Twój moduł z mysql2

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM reading_norms';

    try {
        const [rows] = await db.execute(sql);

        res.status(200).json({
            norms: rows
        });
    } catch (err) {
        console.error("❌ Błąd pobierania współczynników normalizacji:", err.message);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

module.exports = router;
