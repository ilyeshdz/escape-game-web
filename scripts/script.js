import { loadStateMachine, getStateMachine } from './stateMachine.js';
import { setupHubspots, initSecretInput, getHubspots, initAccessibility } from './hubspots.js';
import { setupResizeHandler } from './resizeHandler.js';
import { initInventory, getInventory } from './inventory.js';
import { initFlags, getFlags } from './flags.js';
import { initCanvasScene } from './canvasScene.js';
import { initToastSystem } from './toast.js';
import { initDebugMode, updateDebugPanel, isDebugEnabled } from './debug.js';

async function init() {
    await loadStateMachine();
    initToastSystem();
    initInventory();
    initFlags();
    initSecretInput();
    initAccessibility();
    await setupHubspots();
    setupResizeHandler();

    const canvas = document.getElementById('game-canvas');
    const hubspotsData = getHubspots();
    initCanvasScene(canvas, './assets/scene1.png', hubspotsData);

    if (isDebugEnabled()) {
        initDebugMode();

        setInterval(() => {
            try {
                const sm = getStateMachine();
                updateDebugPanel(sm.getState(), getInventory(), getFlags(), hubspotsData);
            } catch {
                // Debug panel update failed - game may not be initialized
            }
        }, 1000);
    }
}

init();
