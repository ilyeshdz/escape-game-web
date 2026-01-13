let itemsCache = null;

export async function loadItems() {
    if (itemsCache) {
        return itemsCache;
    }
    try {
        const response = await fetch('data/items.json');
        if (!response.ok) {
            throw new Error(`Failed to load items: ${response.status}`);
        }
        const data = await response.json();
        itemsCache = data.items || {};
        return itemsCache;
    } catch (error) {
        /* eslint-disable no-console */
        console.error('Error loading items:', error);
        /* eslint-enable no-console */
        itemsCache = {};
        return itemsCache;
    }
}

export async function getItem(itemId) {
    const items = await loadItems();
    return items[itemId] || null;
}

export async function getAllItems() {
    return await loadItems();
}

export async function getItemTemplate(itemId) {
    const items = await loadItems();
    const template = items[itemId];
    if (!template) {
        return null;
    }
    return {
        id: itemId,
        ...template
    };
}

export function clearItemsCache() {
    itemsCache = null;
}

export async function validateItems() {
    const items = await loadItems();
    const definedItemIds = Object.keys(items);
    return {
        count: definedItemIds.length,
        itemIds: definedItemIds
    };
}

export async function validateItemReferences(hubspotsData) {
    const items = await loadItems();
    const definedItemIds = Object.keys(items);
    const invalidReferences = [];
    const unusedItems = new Set(definedItemIds);

    function findItemReferences(obj, path = '') {
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
            obj.forEach((item, index) => findItemReferences(item, `${path}[${index}]`));
            return;
        }

        for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;

            if (key === 'itemId' && typeof value === 'string') {
                if (!definedItemIds.includes(value)) {
                    invalidReferences.push({
                        itemId: value,
                        location: currentPath
                    });
                } else {
                    unusedItems.delete(value);
                }
            } else if (typeof value === 'object' && value !== null) {
                findItemReferences(value, currentPath);
            }
        }
    }

    findItemReferences(hubspotsData);

    return {
        invalidReferences,
        unusedItems: Array.from(unusedItems),
        isValid: invalidReferences.length === 0
    };
}

export async function getAvailableItems() {
    const items = await loadItems();
    return Object.entries(items).map(([id, item]) => ({
        id,
        name: item.name,
        emoji: item.emoji || '',
        category: item.category || 'misc'
    }));
}
