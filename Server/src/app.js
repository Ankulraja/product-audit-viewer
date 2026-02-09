const express = require('express');
const config = require('./config');
const setupMiddleware = require('./middleware');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Setup middleware
setupMiddleware(app);

// Mount API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${config.PORT}`);
    console.log('\n📡 API Endpoints:');
    console.log(`   GET /api/product-audit  - Sequential grouped data`);
    console.log(`   GET /api/sheets         - Raw sheet data`);
    console.log(`   GET /api/health         - Health check\n`);
});

module.exports = app;
