const express = require('express');
const router = express.Router();
const db = require('../db/connect'); // Twój moduł z mysql2
const checkToken = require('../middleware/checkToken');

router.put('/settings', checkToken, async (req, res) => {
    const { login, continent, country, locality, flat_name, norms } = req.body;
    const userId = req.user.user.userId; 

    try {
        // 1️⃣ Aktualizacja użytkownika
        await db.execute(
            `UPDATE users 
             SET login = ?, continent = ?, country = ?, locality = ?, flat_name = ? 
             WHERE user_id = ?`,
            [login, continent, country, locality, flat_name, userId]
        );

        // 2️⃣ Aktualizacja norm
        for (const norm of norms) {
            const { norm_id, optimal_min, optimal_max, warning_min, warning_max, critical_min, critical_max } = norm;

            await db.execute(
                `UPDATE reading_norms 
                 SET optimal_min = ?, optimal_max = ?, warning_min = ?, warning_max = ?, critical_min = ?, critical_max = ? 
                 WHERE norm_id = ?`,
                [optimal_min, optimal_max, warning_min, warning_max, critical_min, critical_max, norm_id]
            );
        }

        res.json({ success: true, message: 'Ustawienia zaktualizowane' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd przy aktualizacji ustawień' });
    }
});

module.exports = router;
