const UI = (() => {
    let isInventoryOpen = false;
    const elements = {
        toggleButton: document.getElementById('inventory-toggle'),
        inventoryPanel: document.getElementById('inventory-panel'),
        gameContainer: document.querySelector('.game-container'),
    };

    function toggleInventory() {
        isInventoryOpen = !isInventoryOpen;
        elements.inventoryPanel?.classList.toggle('active', isInventoryOpen);
        if (elements.toggleButton) {
            elements.toggleButton.textContent = isInventoryOpen ? '✕' : '📦';
        }
    }

    function closeInventory() {
        if (isInventoryOpen) {
            isInventoryOpen = false;
            elements.inventoryPanel?.classList.remove('active');
            if (elements.toggleButton) {
                elements.toggleButton.textContent = '📦';
            }
        }
    }

    function isInventoryPanelOpen() {
        return isInventoryOpen;
    }

    function init() {
        elements.toggleButton?.addEventListener('click', toggleInventory);
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'i' && document.activeElement.tagName !== 'INPUT') {
                toggleInventory();
            }
        });
        elements.gameContainer?.addEventListener('click', () => {
            if (isInventoryPanelOpen()) {
                closeInventory();
            }
        });
    }

    return { init, isInventoryPanelOpen };
})();

export const { init: initUI, isInventoryPanelOpen } = UI;
