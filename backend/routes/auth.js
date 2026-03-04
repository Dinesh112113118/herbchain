const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory fallback if MongoDB is not running
const inMemoryUsers = [];

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const mongoConnected = req.app.locals.mongoConnected;

    try {
        if (mongoConnected) {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({ name, email, password, role });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = { user: { id: user.id, role: user.role } };
            jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id || user._id, name: user.name, email: user.email, role: user.role } });
            });
        } else {
            // Fallback
            const userExists = inMemoryUsers.find(u => u.email === email);
            if (userExists) return res.status(400).json({ msg: 'User already exists (in-memory)' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role };
            inMemoryUsers.push(newUser);

            const payload = { user: { id: newUser.id, role: newUser.role } };
            jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const mongoConnected = req.app.locals.mongoConnected;

    try {
        let user = null;
        let isMatch = false;

        if (mongoConnected) {
            user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            user = inMemoryUsers.find(u => u.email === email);
            if (!user) return res.status(400).json({ msg: 'Invalid Credentials (in-memory)' });
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id || user._id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id || user._id, name: user.name, email: user.email, role: user.role } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
