const path = require('path');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    SPREADSHEET_ID: process.env.SPREADSHEET_ID || '1bmSPL9zVykkjcvGKLApaJ2ErENRwrbSMAoyiiIAyBF0',
    GOOGLE_CREDENTIALS_PATH: path.join(__dirname, '../..', 'google.json'),
    GOOGLE_SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],
    // For Render: use environment variable for Google credentials JSON
    GOOGLE_CREDENTIALS_JSON: process.env.GOOGLE_CREDENTIALS_JSON || null
};
