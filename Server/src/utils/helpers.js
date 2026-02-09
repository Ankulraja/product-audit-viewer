/**
 * Parse predicted_attributes string to object
 * Handles formats like: {"type":"construction"} or type:construction
 */
function parsePredictedAttributes(attrString) {
    if (!attrString) return {};
    
    try {
        // Try JSON parse first
        return JSON.parse(attrString);
    } catch {
        // Try parsing key:value format
        const result = {};
        const pairs = attrString.split(',');
        pairs.forEach(pair => {
            const [key, value] = pair.split(':').map(s => s.trim().replace(/['"{}]/g, ''));
            if (key && value) {
                result[key] = value;
            }
        });
        return result;
    }
}

/**
 * Wrap async route handlers to catch errors
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    parsePredictedAttributes,
    asyncHandler
};
