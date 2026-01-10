import { loadStateMachine } from './stateMachine.js';
import { setupHubspots, initSecretInput, getHubspots, initAccessibility } from './hubspots.js';
import { setupResizeHandler } from './resizeHandler.js';
import { initInventory } from './inventory.js';
import { initFlags } from './flags.js';
import { initCanvasScene } from './canvasScene.js';

async function init() {
    try {
        await loadStateMachine();
        initInventory();
        initFlags();
        initSecretInput();
        initAccessibility();
        await setupHubspots();
        setupResizeHandler();

        const canvas = document.getElementById('game-canvas');
        const hubspotsData = getHubspots();
        initCanvasScene(canvas, './assets/scene1.png', hubspotsData);
    } catch (error) {
        console.error('[Script] Initialization failed:', error);
    }
}

init();
