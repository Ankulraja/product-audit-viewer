const { parsePredictedAttributes } = require('./helpers');

/**
 * Transform raw sheet data using SEQUENTIAL/CONTIGUOUS GROUPING
 * Groups consecutive rows with same (query + cityname)
 * 
 * GROUPING RULES:
 * 1. Process rows strictly in order (top → bottom)
 * 2. Create NEW JSON object when:
 *    - First row, OR
 *    - query changes, OR
 *    - cityname changes, OR
 *    - same (query + cityname) appears again after a break
 * 3. ONLY consecutive rows with identical (query + cityname) are grouped
 * 4. NO global grouping by query + cityname
 */
function transformToSequentialGroups(rows) {
    if (!rows || rows.length === 0) return [];

    const groups = [];
    let currentGroup = null;
    let currentKey = null;

    rows.forEach((row) => {
        const rowQuery = row.query || '';
        const rowCity = row.cityname || '';
        const key = `${rowQuery}|||${rowCity}`;

        // Check if we need to start a new group
        if (currentKey !== key) {
            // Save previous group if exists
            if (currentGroup) {
                // Set total_results count before pushing
                currentGroup.product_agent_response.total_results = currentGroup.product_agent_response.results.length;
                groups.push(currentGroup);
            }

            // Create new group with query-level data from FIRST row of the group
            currentGroup = {
                query: rowQuery,
                city: rowCity,

                query_agent_response: {
                    agent_name: row.agent1_name_V32 || '',
                    user_requirement: row.user_requirement_V32 || '',
                    query_type: row.query_type_V32 || '',
                    core_product: row.core_product_V32 || '',
                    predicted_attributes: parsePredictedAttributes(row.predicted_attributes_V32)
                },

                product_agent_response: {
                    agent_name: row.agent2_name_V32 || '',
                    total_results: 0,
                    results: []
                },

                metadata: {
                    date: row.date_V32 || '',
                    workflow: row.workflow_V32 || ''
                }
            };
            currentKey = key;
        }

        // Add product-level data to current group's results array
        currentGroup.product_agent_response.results.push({
            result_number: row.result_number || '',
            display_id: row.display_id || '',
            title: row.title || '',
            specifications: row.specifications || '',
            image: row.image || '',
            search_page_url: row.search_page_url || '',
            relevance: row.relevance_V32 || '',
            critical_relevance: row.critical_relevance_V32 || '',
            relevance_reasoning: row['relevance reasoning_V32'] || row.relevance_reasoning_V32 || '',
            critical_relevance_reasoning: row['critical relevance reasoning_V32'] || row.critical_relevance_reasoning_V32 || '',
            super_audit_relevance: row.super_audit_relevance || row.superaudit_relevance || row['super audit relevance'] || ''
        });
    });

    // Don't forget the last group
    if (currentGroup) {
        currentGroup.product_agent_response.total_results = currentGroup.product_agent_response.results.length;
        groups.push(currentGroup);
    }

    return groups;
}

module.exports = {
    transformToSequentialGroups
};
