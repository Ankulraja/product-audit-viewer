const { google } = require('googleapis');
const config = require('./index');

// Initialize Google Auth - supports both file-based and environment variable credentials
let auth;

if (config.GOOGLE_CREDENTIALS_JSON) {
    // Use environment variable (for Render deployment)
    const credentials = JSON.parse(config.GOOGLE_CREDENTIALS_JSON);
    auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: config.GOOGLE_SCOPES
    });
} else {
    // Use file-based credentials (for local development)
    auth = new google.auth.GoogleAuth({
        keyFile: config.GOOGLE_CREDENTIALS_PATH,
        scopes: config.GOOGLE_SCOPES
    });
}

// Get Google Sheets instance
const getSheets = () => {
    return google.sheets({ version: 'v4', auth });
};

module.exports = {
    auth,
    getSheets
};
