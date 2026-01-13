/* eslint-disable no-console */
/**
 * Debug mode for development and testing
 *
 * Enable via:
 * - URL: ?debug=true
 * - localStorage: set 'escapeGame_debug' to 'true'
 */

const DEBUG_ENABLED = getDebugEnabled();

function getDebugEnabled() {
    if (location.search.includes('debug=true')) {
        return true;
    }
    return localStorage.getItem('escapeGame_debug') === 'true';
}

import { getStateMachine } from './stateMachine.js';
import { updateHubspotsVisibility } from './hubspots.js';
import { addItem, hasItem, clearInventory } from './inventory.js';
import { setFlag, unsetFlag, getFlags } from './flags.js';
import { getItemTemplate, getAvailableItems } from './items.js';

let debugPanelVisible = false;
let consoleCommandsEnabled = false;

export function initDebugMode() {
    if (!DEBUG_ENABLED) return;

    setupDebugPanel();
    setupConsoleCommands();

    console.log(
        '%c[Debug Mode] Enabled. Press D to toggle debug panel.',
        'color: lime; font-weight: bold;'
    );
}

function setupDebugPanel() {
    setupDebugPanelHTML();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            toggleDebugPanel();
        }
    });
}

function toggleDebugPanel() {
    debugPanelVisible = !debugPanelVisible;
    const panel = document.getElementById('debug-panel');
    if (panel) {
        panel.style.display = debugPanelVisible ? 'block' : 'none';
    }
}

function setupDebugPanelHTML() {
    const existingPanel = document.getElementById('debug-panel');
    if (existingPanel) return;

    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.className = 'debug-panel';
    panel.style.display = 'none';
    panel.innerHTML = `
        <div class="debug-header">
            <span>Debug Panel</span>
            <button id="debug-close" class="debug-close">&times;</button>
        </div>
        <div class="debug-content">
            <div class="debug-section">
                <h4>State</h4>
                <div id="debug-state" class="debug-info">Loading...</div>
            </div>
            <div class="debug-section">
                <h4>Inventory</h4>
                <div id="debug-inventory" class="debug-info">Empty</div>
            </div>
            <div class="debug-section">
                <h4>Flags</h4>
                <div id="debug-flags" class="debug-info">None</div>
            </div>
            <div class="debug-section">
                <h4>Hubspots</h4>
                <div id="debug-hubspots" class="debug-info">Loading...</div>
            </div>
            <div class="debug-section">
                <h4>Quick Actions</h4>
                <button id="debug-skip" class="debug-btn">Skip Level</button>
                <button id="debug-clear-inv" class="debug-btn">Clear Inventory</button>
                <button id="debug-reset" class="debug-btn">Reset Game</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('#debug-close').addEventListener('click', toggleDebugPanel);
    panel.querySelector('#debug-skip').addEventListener('click', () => executeCommand('skip'));
    panel
        .querySelector('#debug-clear-inv')
        .addEventListener('click', () => executeCommand('clear'));
    panel.querySelector('#debug-reset').addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });
}

export function updateDebugPanel(state, inventory, flags, hubspots) {
    if (!DEBUG_ENABLED) return;

    const panel = document.getElementById('debug-panel');
    if (!panel) return;

    const stateEl = document.getElementById('debug-state');
    const inventoryEl = document.getElementById('debug-inventory');
    const flagsEl = document.getElementById('debug-flags');
    const hubspotsEl = document.getElementById('debug-hubspots');

    if (stateEl) stateEl.textContent = state || 'Unknown';
    if (inventoryEl) {
        if (inventory && inventory.length > 0) {
            inventoryEl.textContent = inventory.map((item) => item.name).join(', ');
        } else {
            inventoryEl.textContent = 'Empty';
        }
    }
    if (flagsEl) {
        const activeFlags = Object.entries(flags || {})
            .filter(([, v]) => v)
            .map(([k]) => k);
        flagsEl.textContent = activeFlags.length > 0 ? activeFlags.join(', ') : 'None';
    }
    if (hubspotsEl) {
        hubspotsEl.textContent = hubspots ? `${hubspots.length} hubspots` : '0 hubspots';
    }
}

function setupConsoleCommands() {
    consoleCommandsEnabled = true;

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = function (...args) {
        originalLog.apply(console, args);
        processConsoleInput(args.join(' '));
    };

    console.warn = function (...args) {
        originalWarn.apply(console, args);
    };

    console.error = function (...args) {
        originalError.apply(console, args);
    };

    window.debugCommand = executeCommand;
}

function processConsoleInput(input) {
    if (!consoleCommandsEnabled || !DEBUG_ENABLED) return;

    const trimmed = input.trim();
    if (!trimmed.startsWith('/')) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    executeCommand(command, arg);
}

export async function executeCommand(command, arg = '') {
    if (!DEBUG_ENABLED) {
        console.warn('Debug mode is disabled');
        return false;
    }

    switch (command) {
        case '/skip':
        case 'skip':
            skipLevel();
            return true;

        case '/spawn':
        case 'spawn':
        case '/give':
        case 'give':
            if (arg) {
                await spawnItem(arg);
                return true;
            }
            console.warn('Usage: /spawn <item-id>');
            return false;

        case '/items':
        case 'items':
            await listItems();
            return true;

        case '/clear':
        case 'clear':
            clearInventoryDebug();
            return true;

        case '/flags':
        case 'flags':
            listFlags();
            return true;

        case '/setflag':
        case 'setflag':
        case '/flag':
        case 'flag':
            if (arg) {
                setDebugFlag(arg);
                return true;
            }
            console.warn('Usage: /setflag <flag-name>');
            return false;

        case '/unsetflag':
        case 'unsetflag':
            if (arg) {
                unsetDebugFlag(arg);
                return true;
            }
            console.warn('Usage: /unsetflag <flag-name>');
            return false;

        case '/help':
        case 'help':
            showDebugHelp();
            return true;

        case '/reset':
        case 'reset':
            resetGame();
            return true;

        default:
            console.warn(`Unknown debug command: ${command}`);
            return false;
    }
}

function skipLevel() {
    try {
        const sm = getStateMachine();
        const currentState = sm.getState();
        const transitions = sm.transitions[currentState];

        if (transitions) {
            const nextState = Object.keys(transitions)[0];
            if (nextState && sm.transition(nextState)) {
                console.log(`%cSkipped to: ${nextState}`, 'color: lime');
                updateHubspotsVisibility();
                return;
            }
        }
        console.warn('Cannot skip: no transitions available from current state');
    } catch (e) {
        console.error('Error skipping level:', e.message);
    }
}

async function spawnItem(itemId) {
    if (hasItem(itemId)) {
        console.warn(`Item already in inventory: ${itemId}`);
        return;
    }

    const template = await getItemTemplate(itemId);
    if (!template) {
        console.warn(
            `Unknown item: ${itemId}. Available items: goldenKey, potion, scroll, gem, apple`
        );
        return;
    }

    const item = {
        ...template
    };

    if (addItem(item)) {
        console.log(`%cSpawned item: ${template.name}`, 'color: lime');
    } else {
        console.warn('Inventory is full or item could not be added');
    }
}

async function listItems() {
    const items = await getAvailableItems();
    console.log('%c=== Available Items ===', 'color: yellow; font-weight: bold;');
    items.forEach((item) => {
        console.log(`${item.emoji} ${item.id} - ${item.name} [${item.category}]`);
    });
    console.log('%cUse /spawn <item-id> to add an item', 'color: cyan');
}

function clearInventoryDebug() {
    clearInventory();
    console.log('%cInventory cleared', 'color: lime');
}

function listFlags() {
    const flags = getFlags();
    const activeFlags = Object.entries(flags)
        .filter(([, v]) => v)
        .map(([k]) => k);
    if (activeFlags.length > 0) {
        console.log('Active flags:', activeFlags.join(', '));
    } else {
        console.log('No active flags');
    }
}

function setDebugFlag(flagName) {
    setFlag(flagName);
    console.log(`%cFlag set: ${flagName}`, 'color: lime');
}

function unsetDebugFlag(flagName) {
    unsetFlag(flagName);
    console.log(`%cFlag unset: ${flagName}`, 'color: lime');
}

function resetGame() {
    localStorage.clear();
    location.reload();
}

function showDebugHelp() {
    console.log('%c=== Debug Commands ===', 'color: yellow; font-weight: bold;');
    console.log('/skip - Skip current level/state');
    console.log('/spawn <id> - Add item to inventory');
    console.log('/items - List all available items');
    console.log('/clear - Clear inventory');
    console.log('/flags - List active flags');
    console.log('/setflag <name> - Set a flag');
    console.log('/unsetflag <name> - Unset a flag');
    console.log('/reset - Reset game (clears localStorage)');
    console.log('/help - Show this help');
}

export function isDebugEnabled() {
    return DEBUG_ENABLED;
}

export function setDebugEnabled(enabled) {
    localStorage.setItem('escapeGame_debug', enabled.toString());
    if (enabled) {
        setupDebugPanel();
        setupConsoleCommands();
        console.log('%c[Debug Mode] Enabled', 'color: lime; font-weight: bold;');
    }
}

export function toggleDebug() {
    setDebugEnabled(!DEBUG_ENABLED);
    if (DEBUG_ENABLED) {
        location.reload();
    }
}
