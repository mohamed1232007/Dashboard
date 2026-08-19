const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mysqlPool } = require('../config/db');

const cookieOptions = {
    httpOnly: true,                       
    maxAge: 100 * 1000,           
    sameSite: 'lax',                      
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    try {
        const [existingUser] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "This email is already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await mysqlPool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'Account created successfully! You can log in now.' });
    } catch (error) {
        res.status(500).json({ message: 'A server error occurred.', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter your email and password!' });
    }

    try {
        const [users] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Email address not found!' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password!' });
        }

        const token = jwt.sign(
            { id: user.UserID, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            message: "Logged in successfully!",
            user: { id: user.UserID, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: 'A server error occurred.', error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
};

exports.me = (req, res) => {
    res.status(200).json({ user: req.user });
};
