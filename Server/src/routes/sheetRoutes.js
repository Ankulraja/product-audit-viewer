const express = require('express');
const router = express.Router();
const { sheetController } = require('../controllers');

// Product-Audit endpoint with sequential grouping
router.get('/product-audit', sheetController.getProductAudit);

// Raw sheet data (legacy)
router.get('/sheets', sheetController.getSheets);

// Health check
router.get('/health', sheetController.healthCheck);

module.exports = router;
