let hubspotsData = [];

/**
 * Loads hubspots data from JSON file
 * @returns {Promise<Array>} Array of hubspot configuration objects
 */
export async function loadHubspotsData() {
    try {
        const response = await fetch('./data/hubspots.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        hubspotsData = await response.json();
        return hubspotsData;
    } catch (error) {
        console.error('[HubspotsData] Error loading hubspots data:', error);
        throw error;
    }
}
