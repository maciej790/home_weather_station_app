const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkUserExistence = require('../middleware/checkUserExistence');
const checkToken = require('../middleware/checkToken');
const checkActivationKey = require('../middleware/checkActivationKey');
const db = require('../db/connect');

const SECRET_KEY = 'secret';
router.post(
    '/register',
    checkUserExistence(true),    
    checkActivationKey,          
    async (req, res) => {
        const { login, email, password, continent, country, locality, flat_name, activation_key } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const hashActivationKey = await bcrypt.hash(activation_key, 10);

        await db.query(
            'INSERT INTO users (login, email, password, continent, country, locality, flat_name, activation_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [login, email, hashedPassword, continent, country, locality, flat_name, hashActivationKey]
        );
            res.status(201).json({ message: 'Użytkownik został aktywowany i zarejestrowany pomyślnie!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Błąd serwera' });
        }
    }
);

// LOGIN
// router.post('/login', checkUserExistence(false), async (req, res) => {
//     const { password } = req.body;

//     if (!password) return res.status(400).json('Wypełnij wszystkie pola!');

//     const isMatch = await bcrypt.compare(password, req.user.password);
//     if (!isMatch) return res.status(401).json('Błędny login lub hasło!');

//     const token = jwt.sign(
//         { userId: req.user.user_id, username: req.user.login },
//         SECRET_KEY,
//         { expiresIn: '24h' }
//     );

//     res.status(200).json({ token });
// });




router.post('/login', checkUserExistence(false), async (req, res) =>{
    const hashedPassword = req.user.password;
    const {password} = req.body;
    
    if(!password) return res.status(400).json('Wypełnij wszystkie pola!');
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) return res.status(401).json('Błędny login lub hasło!');



    const userId = req.user.user_id;
    const username = req.user.login;
    const continent = req.user.continent;
    const country = req.user.country;
    const locality = req.user.locality;
    const flat_name = req.user.flat_name;

    const user = {
      userId,
      username,
      continent,
      country,
      locality,
      flat_name
    }

    console.log(user)

    const token = jwt.sign({user}, SECRET_KEY);

    res.status(200).json(token);
})

router.get('/logged', checkToken, (req, res) =>{
    res.status(200).json(req.user);
})

module.exports = router;
