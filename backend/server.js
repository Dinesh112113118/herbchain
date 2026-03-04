const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chain', require('./routes/api'));

const PORT = process.env.PORT || 5000;

// Since MongoDB might not be installed on the user's machine or running,
// we will start the server and attempt to connect, but not crash if it fails.
// We'll also provide a fallback in auth to use in-memory users if Mongo fails.

let mongoConnected = false;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/herbchain", { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log('MongoDB Connected...');
        app.locals.mongoConnected = true;
    })
    .catch(err => {
        console.error('MongoDB connection failed. Using in-memory fallback for auth.', err.message);
        app.locals.mongoConnected = false;
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // In mock mode without a real DB or network, Node might exit if there are no pending callbacks.
    // We add a dummy interval to keep the event loop alive for testing.
    setInterval(() => { }, 1000 * 60 * 60);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
