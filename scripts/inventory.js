/**
 * Inventory system for managing collected items
 */
let inventory = [];
let selectedItem = null;

export function initInventory() {
    inventory = [];
    selectedItem = null;
    updateInventoryUI();
}

export function addItem(item) {
    if (!item || !item.id || hasItem(item.id)) {
        return false;
    }
    inventory.push(item);
    updateInventoryUI();
    return true;
}

export function removeItem(itemId) {
    const index = inventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
        inventory.splice(index, 1);
        if (selectedItem === itemId) {
            selectedItem = null;
        }
        updateInventoryUI();
        return true;
    }
    return false;
}

export function hasItem(itemId) {
    return inventory.some(item => item.id === itemId);
}

export function hasAllItems(itemIds) {
    return itemIds.every(hasItem);
}

export function hasAnyItem(itemIds) {
    return itemIds.some(hasItem);
}

export function hasNoneOfItems(itemIds) {
    return itemIds.every(itemId => !hasItem(itemId));
}

export function getItem(itemId) {
    return inventory.find(item => item.id === itemId) || null;
}

export function getInventory() {
    return [...inventory];
}

export function selectItem(itemId) {
    selectedItem = itemId;
    updateInventoryUI();
}

export function getSelectedItem() {
    return selectedItem;
}

export function getSelectedItemObject() {
    return selectedItem ? getItem(selectedItem) : null;
}

export function checkInventoryCondition(condition) {
    if (!condition) return true;
    if (condition.requireItems && !hasAllItems(condition.requireItems)) return false;
    if (condition.requireAnyItems && !hasAnyItem(condition.requireAnyItems)) return false;
    if (condition.requireNotItems && !hasNoneOfItems(condition.requireNotItems)) return false;
    return true;
}

export function inspectItem(itemId) {
    const item = getItem(itemId);
    if (item) {
        showInspectModal(item);
    }
}

function updateInventoryUI() {
    const inventoryContainer = document.getElementById('inventory-items');
    if (!inventoryContainer) return;

    inventoryContainer.innerHTML = '';
    inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.dataset.itemId = item.id;
        itemElement.title = item.name;
        if (item.icon) {
            const icon = document.createElement('img');
            icon.src = item.icon;
            icon.alt = item.name;
            itemElement.appendChild(icon);
        } else {
            const text = document.createElement('span');
            text.textContent = item.name.substring(0, 2).toUpperCase();
            itemElement.appendChild(text);
        }
        if (selectedItem === item.id) {
            itemElement.classList.add('selected');
        }
        itemElement.addEventListener('click', () => selectItem(selectedItem === item.id ? null : item.id));
        itemElement.addEventListener('dblclick', () => inspectItem(item.id));
        inventoryContainer.appendChild(itemElement);
    });
}

function showInspectModal(item) {
    const modal = document.getElementById('item-inspect-modal');
    if (!modal) return;

    const title = modal.querySelector('#inspect-item-title');
    const description = modal.querySelector('#inspect-item-description');
    const icon = modal.querySelector('#inspect-item-icon');

    if (title) title.textContent = item.name;
    if (description) description.textContent = item.description || 'No description available';
    if (icon) {
        if (item.icon) {
            icon.src = item.icon;
            icon.style.display = 'block';
        } else {
            icon.style.display = 'none';
        }
    }
    modal.classList.add('active');
}

export function hideInspectModal() {
    const modal = document.getElementById('item-inspect-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

export function debugInventory() {
    console.log('=== INVENTORY DEBUG ===');
    console.log(inventory.length > 0 ? inventory : 'Inventory is empty');
    console.log(`Selected: ${selectedItem || 'none'}`);
    console.log('=======================');
}
