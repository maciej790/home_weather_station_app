const db = require('../db/connect');
const bcrypt = require('bcrypt');

const checkActivationKey = async (req, res, next) => {
    const { activation_key } = req.body;
    if (!activation_key) return res.status(400).json('Klucz aktywacyjny jest wymagany!');

    try {
        // Pobieramy wszystkich użytkowników, którzy mają wciąż hash w activation_key
        const [rows] = await db.query(
            'SELECT * FROM users WHERE activation_key IS NOT NULL'
        );

        if (!rows.length) return res.status(401).json('Nieprawidłowy klucz aktywacyjny!');

        // Szukamy wiersza pasującego do podanego klucza
        let matchedUser = null;
        for (const row of rows) {
            const match = await bcrypt.compare(activation_key, row.activation_key);
            if (match) {
                matchedUser = row;
                break;
            }
        }

        if (!matchedUser) return res.status(401).json('Nieprawidłowy klucz aktywacyjny!');

        req.activation_user = matchedUser;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json('Błąd serwera');
    }
};

module.exports = checkActivationKey;
