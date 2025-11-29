const db = require('../db/connect')

const checkUserExistence = (isRegister) => async (req, res, next) => {
    const { login, email } = req.body;
    if (!login) return res.status(400).json('Wypełnij wszystkie pola!');

    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE login = ? OR email = ?',
            [login, email]
        );

        if (isRegister) {
            if (rows.length > 0) return res.status(409).json('Ten użytkownik już istnieje!');
        } else {
            if (rows.length === 0) return res.status(401).json('Błędny login lub hasło!');
            req.user = rows[0];
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json('Błąd serwera!');
    }
};
module.exports = checkUserExistence;