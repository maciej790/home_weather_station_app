const express = require('express');
const router = express.Router();
const db = require('../db/connect'); // Twój moduł z mysql2
const checkToken = require('../middleware/checkToken');
const nodemailer = require('nodemailer');

// Map do przechowywania timestamp ostatniego alertu w pamięci
const lastAlerts = new Map();
const ALERT_INTERVAL = 60 * 60 * 1000; // 1 godzina w ms

// Konfiguracja nodemailer (SMTP)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true dla 465, false dla 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

router.post('/send_alert', checkToken, async (req, res) => {
    try {
        const userId = req.user.user.userId;

        // Pobranie isEmailSubscribe i email użytkownika
        const [userRows] = await db.query(
            'SELECT isEmailSubscribe, email FROM users WHERE user_id = ?',
            [userId]
        );

        if (userRows.length === 0 || userRows[0].isEmailSubscribe !== 1) {
            return res.status(403).json({ error: 'User is not subscribed to alerts' });
        }

        const userEmail = userRows[0].email;

        const { alerts } = req.body;
        if (!alerts || !Array.isArray(alerts)) {
            return res.status(400).json({ error: 'Invalid payload: alerts array required' });
        }

        const now = Date.now();
        const alertsToSave = [];

        for (const alert of alerts) {
            const last = lastAlerts.get(alert.sensor);

            // Throttling w pamięci
            if (!last || now - last > ALERT_INTERVAL) {

                // Sprawdzenie w DB, czy w ostatniej minucie był alert dla tego sensora
                const [rows] = await db.query(
                    `SELECT 1 FROM alerts 
                     WHERE sensor = ? AND timestamp > NOW() - INTERVAL 1 MINUTE
                     LIMIT 1`,
                    [alert.sensor]
                );

                if (rows.length === 0) {
                    alertsToSave.push([alert.sensor, alert.value, alert.status, alert.timestamp, userId]);
                    lastAlerts.set(alert.sensor, now);

                    // 🔥 Wysyłka e-maila tylko jeśli alert zostaje zapisany
                    const mailOptions = {
                        from: `"Home Weather Station" <${process.env.SMTP_USER}>`,
                        to: userEmail,
                        subject: `ALERT: ${alert.sensor} = ${alert.value} (${alert.status})`,
                        text: `Sensor: ${alert.sensor}\nValue: ${alert.value}\nStatus: ${alert.status}\nTimestamp: ${alert.timestamp}`,
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) console.error('Error sending email:', err);
                        else console.log(`Alert email sent to ${userEmail}: ${info.response}`);
                    });
                }
            }
        }

        if (alertsToSave.length > 0) {
            const sql = "INSERT INTO alerts (sensor, value, status, timestamp, user_id) VALUES ?";
            await db.query(sql, [alertsToSave]);
        }

        res.status(200).json({ saved: alertsToSave.length });
    } catch (err) {
        console.error('Error saving alerts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
