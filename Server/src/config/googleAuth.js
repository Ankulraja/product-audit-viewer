const { google } = require('googleapis');
const config = require('./index');

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
    keyFile: config.GOOGLE_CREDENTIALS_PATH,
    scopes: config.GOOGLE_SCOPES
});

// Get Google Sheets instance
const getSheets = () => {
    return google.sheets({ version: 'v4', auth });
};

module.exports = {
    auth,
    getSheets
};
