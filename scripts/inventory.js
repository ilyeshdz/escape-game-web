/**
 * Inventory system for managing collected items
 */

let inventory = [];
let selectedItem = null;
let hoveredItem = null;
let tooltipTimeout = null;
const INVENTORY_SIZE = 9;
const STORAGE_KEY = 'escapeGame_inventory';

export function initInventory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            inventory = data.inventory || [];
            selectedItem = data.selectedItem || null;
        } catch {
            inventory = [];
            selectedItem = null;
        }
    } else {
        inventory = [];
        selectedItem = null;
    }
    setupInventoryShortcuts();
    updateInventoryUI();
}

function saveInventory() {
    const data = {
        inventory: inventory,
        selectedItem: selectedItem
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function setupInventoryShortcuts() {
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key >= '1' && key <= '9') {
            const slotIndex = parseInt(key) - 1;
            const item = inventory[slotIndex];
            if (item) {
                selectItem(selectedItem === item.id ? null : item.id);
            } else {
                selectItem(null);
            }
        }
    });
}

export function addItem(item) {
    if (!item || !item.id || hasItem(item.id)) {
        return false;
    }
    if (inventory.length >= INVENTORY_SIZE) {
        return false;
    }
    inventory.push(item);
    saveInventory();
    updateInventoryUI();
    return true;
}

export function removeItem(itemId) {
    const index = inventory.findIndex((item) => item.id === itemId);
    if (index !== -1) {
        inventory.splice(index, 1);
        if (selectedItem === itemId) {
            selectedItem = null;
        }
        saveInventory();
        updateInventoryUI();
        return true;
    }
    return false;
}

export function hasItem(itemId) {
    return inventory.some((item) => item.id === itemId);
}

export function hasAllItems(itemIds) {
    return itemIds.every(hasItem);
}

export function hasAnyItem(itemIds) {
    return itemIds.some(hasItem);
}

export function hasNoneOfItems(itemIds) {
    return itemIds.every((itemId) => !hasItem(itemId));
}

export function getInventory() {
    return inventory;
}

export function getItem(itemId) {
    return inventory.find((item) => item.id === itemId) || null;
}

export function selectItem(itemId) {
    selectedItem = itemId;
    saveInventory();
    updateInventoryUI();
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

function updateInventoryUI() {
    const slotsContainer = document.getElementById('inventory-items');
    if (!slotsContainer) return;

    slotsContainer.innerHTML = '';
    for (let i = 0; i < INVENTORY_SIZE; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slotIndex = i;

        const number = document.createElement('span');
        number.className = 'slot-number';
        number.textContent = i + 1;
        slot.appendChild(number);

        const item = inventory[i];
        if (item) {
            slot.classList.add('occupied');
            slot.dataset.itemId = item.id;
            slot.removeAttribute('title');

            if (item.icon) {
                const icon = document.createElement('img');
                icon.src = item.icon;
                icon.alt = item.name;
                icon.className = 'slot-icon';
                slot.appendChild(icon);
            } else if (item.emoji) {
                const emoji = document.createElement('span');
                emoji.textContent = item.emoji;
                emoji.className = 'slot-emoji';
                slot.appendChild(emoji);
            } else {
                const text = document.createElement('span');
                text.textContent = item.name.substring(0, 2).toUpperCase();
                text.className = 'slot-text';
                slot.appendChild(text);
            }

            if (selectedItem === item.id) {
                slot.classList.add('selected');
            }

            slot.addEventListener('click', () => {
                selectItem(selectedItem === item.id ? null : item.id);
            });
            slot.addEventListener('mouseenter', (e) => handleSlotHover(item, e));
            slot.addEventListener('mouseleave', handleSlotLeave);
            slot.addEventListener('touchstart', (e) => handleSlotTouch(item, e), {
                passive: false
            });
        }

        slotsContainer.appendChild(slot);
    }
}

function showTooltip(item, event) {
    const tooltip = document.getElementById('inventory-tooltip');
    if (!tooltip || !item) return;

    const tooltipIcon = document.getElementById('tooltip-icon');
    const tooltipName = document.getElementById('tooltip-name');
    const tooltipDescription = document.getElementById('tooltip-description');
    const tooltipMeta = document.getElementById('tooltip-meta');

    if (tooltipIcon) {
        tooltipIcon.innerHTML = '';
        if (item.icon) {
            const img = document.createElement('img');
            img.src = item.icon;
            img.alt = item.name;
            tooltipIcon.appendChild(img);
        } else if (item.emoji) {
            tooltipIcon.textContent = item.emoji;
        }
    }

    if (tooltipName) {
        tooltipName.textContent = item.name;
    }

    if (tooltipDescription) {
        tooltipDescription.textContent = item.description || '';
        tooltipDescription.style.display = item.description ? 'block' : 'none';
    }

    if (tooltipMeta) {
        tooltipMeta.innerHTML = '';
        if (item.usable) {
            const usableTag = document.createElement('span');
            usableTag.className = 'tooltip-meta-item usable';
            usableTag.textContent = 'Utilisable';
            tooltipMeta.appendChild(usableTag);
        }
        if (item.consumable) {
            const consumableTag = document.createElement('span');
            consumableTag.className = 'tooltip-meta-item consumable';
            consumableTag.textContent = 'Consommable';
            tooltipMeta.appendChild(consumableTag);
        }
        tooltipMeta.style.display = tooltipMeta.children.length > 0 ? 'flex' : 'none';
    }

    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let x = rect.right + 12;
    let y = rect.top;

    if (x + tooltipRect.width > window.innerWidth - 20) {
        x = rect.left - tooltipRect.width - 12;
    }
    if (x < 10) {
        x = 10;
    }

    if (y + tooltipRect.height > window.innerHeight - 20) {
        y = window.innerHeight - tooltipRect.height - 20;
    }
    if (y < 10) {
        y = 10;
    }

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
    hoveredItem = item.id;
}

function hideTooltip() {
    const tooltip = document.getElementById('inventory-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
    }
    hoveredItem = null;
}

function handleSlotHover(item, event) {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }
    if (item && item.id !== hoveredItem) {
        showTooltip(item, event);
    }
}

function handleSlotLeave() {
    tooltipTimeout = setTimeout(() => {
        hideTooltip();
    }, 150);
}

function handleSlotTouch(item, event) {
    event.preventDefault();
    if (hoveredItem === item.id) {
        hideTooltip();
    } else {
        const touch = event.touches[0];
        const mockEvent = {
            target: event.target,
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        showTooltip(item, mockEvent);
    }
}

export function clearInventory() {
    inventory = [];
    selectedItem = null;
    localStorage.removeItem(STORAGE_KEY);
    updateInventoryUI();
}
