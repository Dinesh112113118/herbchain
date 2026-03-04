const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fabricNetwork = require('../fabric/network');

// Middleware to protect routes and verify roles
function auth(roles = []) {
    return function (req, res, next) {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded.user;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ msg: 'Unauthorized role' });
            }

            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    };
}

// @route   POST api/chain/collection
// @desc    Register a new collection
// @access  Collector
router.post('/collection', auth(['collector']), async (req, res) => {
    try {
        const { collectionId, herbName, collectorName, lat, long, quantity, farmDetails, timestamp } = req.body;
        const result = await fabricNetwork.submitTransaction(
            'registerCollection',
            collectionId, herbName, collectorName, lat.toString(), long.toString(), quantity.toString(), farmDetails, timestamp.toString()
        );
        res.json(JSON.parse(result));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// @route   POST api/chain/test
// @desc    Upload quality test result
// @access  Lab
router.post('/test', auth(['lab']), async (req, res) => {
    try {
        const { testId, collectionId, moisturePercentage, pesticideStatus, labName, testDate } = req.body;
        const result = await fabricNetwork.submitTransaction(
            'uploadQualityTest',
            testId, collectionId, moisturePercentage.toString(), pesticideStatus, labName, testDate.toString()
        );
        res.json(JSON.parse(result));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// @route   POST api/chain/batch
// @desc    Create product batch
// @access  Manufacturer
router.post('/batch', auth(['manufacturer']), async (req, res) => {
    try {
        const { batchId, linkedCollectionIds, linkedTestIds, manufactureDate, expiryDate, qrHash } = req.body;
        const result = await fabricNetwork.submitTransaction(
            'createBatch',
            batchId, linkedCollectionIds.join(','), linkedTestIds.join(','), manufactureDate, expiryDate, qrHash
        );
        res.json(JSON.parse(result));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/chain/traceability/:batchId
// @desc    Get full traceability of a batch
// @access  Public (Verification Page)
router.get('/traceability/:batchId', async (req, res) => {
    try {
        const result = await fabricNetwork.evaluateTransaction('getFullTraceability', req.params.batchId);
        res.json(JSON.parse(result));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/chain/all-collections
// @desc    Get all collections (Mock helper for Lab/Manufacturer Dashboards to select items)
// @access  Lab, Manufacturer
router.get('/all-collections', auth(['collector', 'lab', 'manufacturer']), async (req, res) => {
    try {
        const result = await fabricNetwork.getAllCollections();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/chain/all-tests
// @desc    Get all tests (Mock helper for Manufacturer Dashboards)
// @access  Manufacturer
router.get('/all-tests', auth(['manufacturer']), async (req, res) => {
    try {
        const result = await fabricNetwork.getAllTests();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/chain/all-batches
// @desc    Get all batches (Mock helper for Manufacturer Dashboard)
// @access  Manufacturer, Lab
router.get('/all-batches', auth(['manufacturer', 'lab']), async (req, res) => {
    try {
        // Query the chaincode for all batches
        const result = await fabricNetwork.getAllBatches();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
