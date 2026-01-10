let hubspotsData = [];

/**
 * Loads hubspots data from JSON file
 * @returns {Promise<Array>} Array of hubspot configuration objects
 */
export async function loadHubspotsData() {
    try {
        console.log('[HubspotsData] Fetching...');
        const response = await fetch('./data/hubspots.json');
        console.log('[HubspotsData] Response:', response);
        console.log('[HubspotsData] Response ok:', response.ok);
        console.log('[HubspotsData] Response status:', response.status);
        console.log('[HubspotsData] Response URL:', response.url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('[HubspotsData] Raw text length:', text.length);
        console.log('[HubspotsData] Raw text:', text.substring(0, 200));
        hubspotsData = JSON.parse(text);
        console.log('[HubspotsData] Parsed:', hubspotsData);
        return hubspotsData;
    } catch (error) {
        console.error('[HubspotsData] Error loading hubspots data:', error);
        throw error;
    }
}

/**
 * Gets the currently loaded hubspots data
 * @returns {Array} Array of hubspot configuration objects
 */
export function getHubspotsData() {
    return hubspotsData;
}
