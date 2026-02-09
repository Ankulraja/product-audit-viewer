const sheetService = require('../services/sheetService');

/**
 * Get Product-Audit data with sequential grouping
 */
async function getProductAudit(req, res) {
    try {
        const data = await sheetService.getProductAuditData();
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get raw sheet data (legacy)
 */
async function getSheets(req, res) {
    try {
        const data = await sheetService.getRawSheetData();
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Health check
 */
function healthCheck(req, res) {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
}

module.exports = {
    getProductAudit,
    getSheets,
    healthCheck
};
