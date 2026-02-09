const cors = require('cors');
const express = require('express');

/**
 * Configure and apply all middleware
 */
function setupMiddleware(app) {
    // Enable CORS
    app.use(cors());
    
    // Parse JSON bodies
    app.use(express.json());
    
    // Parse URL-encoded bodies
    app.use(express.urlencoded({ extended: true }));
    
    // Request logging (simple)
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

module.exports = setupMiddleware;
