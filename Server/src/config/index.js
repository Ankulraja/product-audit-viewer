const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    SPREADSHEET_ID: '1bmSPL9zVykkjcvGKLApaJ2ErENRwrbSMAoyiiIAyBF0',
    GOOGLE_CREDENTIALS_PATH: path.join(__dirname, '../..', 'google.json'),
    GOOGLE_SCOPES: ['https://www.googleapis.com/auth/spreadsheets']
};
