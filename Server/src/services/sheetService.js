const { getSheets } = require('../config/googleAuth');
const config = require('../config');
const { transformToSequentialGroups } = require('../utils/transformers');

class SheetService {
    constructor() {
        this.spreadsheetId = config.SPREADSHEET_ID;
    }

    /**
     * Read sheet and convert rows to objects with headers
     * If no range specified, fetches ALL data from the sheet
     */
    async readSheetRaw(sheetName, range = null) {
        const sheets = getSheets();
        // If no range specified, just use sheet name to get ALL data
        const fullRange = range ? `${sheetName}!${range}` : sheetName;

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: fullRange
            });
            const rows = response.data.values;

            if (rows && rows.length) {
                const headers = rows[0];
                const data = rows.slice(1).map(row => {
                    let obj = {};
                    headers.forEach((header, index) => {
                        obj[header.trim()] = row[index] || '';
                    });
                    return obj;
                });
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error reading sheet:', error);
            throw error;
        }
    }

    /**
     * Read Product-Audit sheet with sequential grouping
     * Fetches ALL columns and rows
     */
    async getProductAuditData() {
        // No range = fetch ALL data
        const rawData = await this.readSheetRaw('Sheet1');
        return transformToSequentialGroups(rawData);
    }

    /**
     * Read raw sheet data
     * Fetches ALL columns and rows by default
     */
    async getRawSheetData(sheetName = 'Sheet1', range = null) {
        return await this.readSheetRaw(sheetName, range);
    }
}

module.exports = new SheetService();
