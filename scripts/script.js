import { loadStateMachine } from './stateMachine.js';
import { setupHubspots, initSecretInput, getHubspots, initAccessibility } from './hubspots.js';
import { setupResizeHandler } from './resizeHandler.js';
import { initInventory } from './inventory.js';
import { initFlags } from './flags.js';
import { initCanvasScene } from './canvasScene.js';
import { initToastSystem } from './toast.js';

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
}

init();
