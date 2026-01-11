let hubspotsData = [];

/**
 * Loads hubspots data from JSON file
 * @returns {Promise<Array>} Array of hubspot configuration objects
 */
export async function loadHubspotsData() {
    const response = await fetch('./data/hubspots.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    hubspotsData = await response.json();
    return hubspotsData;
}
