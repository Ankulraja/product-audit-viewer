const express = require('express');
const router = express.Router();
const sheetRoutes = require('./sheetRoutes');

// Mount all routes
router.use('/', sheetRoutes);

module.exports = router;
