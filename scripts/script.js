import { loadStateMachine } from './stateMachine.js';
import { setupHubspots, initSecretInput } from './hubspots.js';
import { setupResizeHandler } from './resizeHandler.js';
import { initInventory } from './inventory.js';
import { initFlags } from './flags.js';
import { initUI } from './ui.js';

async function init() {
    try {
        await loadStateMachine();
        initInventory();
        initFlags();
        initUI();
        initSecretInput();
        await setupHubspots();
        setupResizeHandler();
    } catch (error) {
        console.error('[Script] Initialization failed:', error);
    }
}

init();
