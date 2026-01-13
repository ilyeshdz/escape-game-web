import { loadStateMachine, getStateMachine } from './stateMachine.js';
import { setupHubspots, initSecretInput, getHubspots, initAccessibility } from './hubspots.js';
import { loadHubspotsData } from './hubspotsData.js';
import { setupResizeHandler } from './resizeHandler.js';
import { initInventory, getInventory } from './inventory.js';
import { initFlags, getFlags } from './flags.js';
import { initCanvasScene } from './canvasScene.js';
import { initToastSystem } from './toast.js';
import { initDebugMode, updateDebugPanel, isDebugEnabled } from './debug.js';
import { validateItemReferences } from './items.js';

async function init() {
    await loadStateMachine();
    initToastSystem();
    initInventory();
    initFlags();
    initSecretInput();
    initAccessibility();
    const hubspotsData = await loadHubspotsData();
    await setupHubspots();
    setupResizeHandler();

    const validation = await validateItemReferences(hubspotsData);
    if (!validation.isValid) {
        /* eslint-disable no-console */
        console.warn('Invalid item references found:');
        validation.invalidReferences.forEach((ref) => {
            console.warn(`  - "${ref.itemId}" referenced at ${ref.location}`);
        });
        if (validation.unusedItems.length > 0) {
            console.warn('Unused item definitions:');
            validation.unusedItems.forEach((id) => {
                console.warn(`  - "${id}"`);
            });
        }
        /* eslint-enable no-console */
    }

    const canvas = document.getElementById('game-canvas');
    const activeHubspots = getHubspots();
    initCanvasScene(canvas, './assets/scene1.png', activeHubspots);

    if (isDebugEnabled()) {
        initDebugMode();

        setInterval(() => {
            try {
                const sm = getStateMachine();
                updateDebugPanel(sm.getState(), getInventory(), getFlags(), activeHubspots);
            } catch {
                // Debug panel update failed - game may not be initialized
            }
        }, 1000);
    }
}

init();
