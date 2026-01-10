import { getStateMachine } from './stateMachine.js';
import { loadHubspotsData, getHubspotsData } from './hubspotsData.js';
import { setFlag, unsetFlag, checkCondition } from './flags.js';
import { addItem, removeItem, getSelectedItemObject } from './inventory.js';
import { checkInventoryCondition } from './inventory.js';

let hubspotElements = [];
let hubspotsData = [];
let hubspotCleanupFunctions = [];

const hubspotHandlers = {
    area: handleAreaAction,
    modal: handleModalAction,
    action: handleAction,
    finish: handleFinishAction,
    link: handleLinkAction,
    secret: showSecretInput,
    pickup: handlePickup,
    useItem: handleUseItem,
};

function createHubspot(hubspotData, container, template) {
    const hubspotElement = template.content.cloneNode(true);
    const hubspot = hubspotElement.querySelector('.hubspot');
    const tooltip = hubspotElement.querySelector('.hubspot-tooltip');

    if (!hubspot || !tooltip) {
        console.error('[Hubspots] Template is missing required elements');
        return null;
    }

    const clickHandler = (e) => {
        e.stopPropagation();
        const type = hubspotData.type || 'action';
        console.log(`[Hubspot] Clicked: ${hubspotData.id} (type: ${type}, state: ${getStateMachine().getState()})`);

        const handler = hubspotHandlers[type];
        if (handler) {
            handler(hubspotData);
        }
    };

    hubspot.addEventListener('click', clickHandler);
    hubspotCleanupFunctions.push({ element: hubspot, handler: clickHandler });

    if (hubspotData.type === 'area') {
        hubspot.classList.add('hubspot-area');
        hubspot.style.width = `${hubspotData.size || 200}px`;
        hubspot.style.height = `${hubspotData.size || 200}px`;
        if (hubspotData.isHidden) {
            hubspot.style.opacity = '0';
        }
    }

    hubspot.dataset.xPercent = hubspotData.x;
    hubspot.dataset.yPercent = hubspotData.y;
    hubspot.dataset.id = hubspotData.id;
    hubspot.dataset.type = hubspotData.type;
    if (hubspotData.action) {
        hubspot.dataset.action = hubspotData.action;
    }
    if (hubspotData.tooltip) {
        tooltip.textContent = hubspotData.tooltip;
    }

    container.appendChild(hubspotElement);
    return hubspot;
}

function executeHubspotActions(hubspotData) {
    if (hubspotData.giveItems) {
        hubspotData.giveItems.forEach(item => {
            if (addItem(item)) {
                if (item.pickupMessage) {
                    setTimeout(() => showModal(item.pickupMessage), 100);
                }
            }
        });
    }
    if (hubspotData.giveFlags) {
        hubspotData.giveFlags.forEach(setFlag);
    }
    if (hubspotData.removeFlags) {
        hubspotData.removeFlags.forEach(unsetFlag);
    }
    if (hubspotData.removeItems) {
        hubspotData.removeItems.forEach(removeItem);
    }
}

function handleAreaAction(hubspotData) {
    if (hubspotData.modalText) showModal(hubspotData.modalText);
    if (hubspotData.url) window.open(hubspotData.url, '_blank');
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        updateHubspotsVisibility();
        if (hubspotData.win !== undefined) {
            showFinish(hubspotData.win);
        }
    }
}

function handleModalAction(hubspotData) {
    showModal(hubspotData.modalText || '');
    executeHubspotActions(hubspotData);
    updateHubspotsVisibility();
}

function handleAction(hubspotData) {
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        updateHubspotsVisibility();
    } else if (hubspotData.action) {
        console.warn(`[Hubspot] Action "${hubspotData.action}" failed for hubspot "${hubspotData.id}"`);
    }
}

function handleFinishAction(hubspotData) {
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        updateHubspotsVisibility();
    }
    showFinish(hubspotData.win !== undefined ? hubspotData.win : true);
}

function handleLinkAction(hubspotData) {
    if (hubspotData.url) {
        window.open(hubspotData.url, '_blank');
    }
}

function handlePickup(hubspotData) {
    if (!checkInventoryCondition({ requireItems: hubspotData.requireItems, requireAnyItems: hubspotData.requireAnyItems })) {
        if (hubspotData.requireMessage) showModal(hubspotData.requireMessage);
        return;
    }
    if (hubspotData.item && addItem(hubspotData.item)) {
        if (hubspotData.item.pickupMessage) showModal(hubspotData.item.pickupMessage);
        updateHubspotsVisibility();
    }
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        updateHubspotsVisibility();
    }
}

function handleUseItem(hubspotData) {
    const selectedItem = getSelectedItemObject();
    if (!selectedItem) {
        showModal(hubspotData.noItemMessage || 'Vous devez sélectionner un objet à utiliser.');
        return;
    }
    if (hubspotData.requireItems && !hubspotData.requireItems.includes(selectedItem.id)) {
        showModal(hubspotData.wrongItemMessage || 'Cet objet ne sert à rien ici.');
        return;
    }
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        if (selectedItem.consumable) {
            removeItem(selectedItem.id);
        }
        updateHubspotsVisibility();
    } else {
        console.warn(`[UseItem] Transition failed for "${hubspotData.id}"`);
    }
}

export async function setupHubspots() {
    hubspotsData = await loadHubspotsData();
    if (hubspotsData.length === 0) {
        console.warn('[Hubspots] No hubspots data loaded');
        return;
    }
    updateHubspotsVisibility();
}

function updateHubspotsVisibility() {
    const hubspotsContainer = document.getElementById('hubspots');
    const template = document.getElementById('hubspot-template');
    const currentState = getStateMachine().getState();

    if (!hubspotsContainer || !template) {
        console.error('[Hubspots] Cannot update visibility: container or template missing');
        return;
    }

    const hubspotDataById = new Map(hubspotsData.map(h => [h.id, h]));
    const activeHubspotIds = new Set();

    hubspotsData.forEach(hubspotData => {
        const isVisibleInState = hubspotData.visibleIn.includes(currentState);
        const meetsConditions = checkCondition({
            requireFlags: hubspotData.requireFlags,
            requireAnyFlags: hubspotData.requireAnyFlags,
            requireNotFlags: hubspotData.requireNotFlags
        }) && checkInventoryCondition({
            requireItems: hubspotData.requireItems,
            requireAnyItems: hubspotData.requireAnyItems,
            requireNotItems: hubspotData.requireNotItems
        });

        if (isVisibleInState && meetsConditions) {
            activeHubspotIds.add(hubspotData.id);
        }
    });

    hubspotElements = hubspotElements.filter(el => {
        const hubspotId = el.dataset.id;
        if (activeHubspotIds.has(hubspotId)) {
            return true; 
        } else {
            const cleanup = hubspotCleanupFunctions.find(c => c.element === el);
            if (cleanup) {
                el.removeEventListener('click', cleanup.handler);
                hubspotCleanupFunctions = hubspotCleanupFunctions.filter(c => c.element !== el);
            }
            el.remove();
            return false;
        }
    });

    activeHubspotIds.forEach(hubspotId => {
        const exists = hubspotElements.some(el => el.dataset.id === hubspotId);
        if (!exists) {
            const hubspotData = hubspotDataById.get(hubspotId);
            const element = createHubspot(hubspotData, hubspotsContainer, template);
            if (element) {
                hubspotElements.push(element);
                if (hubspotData.autoShow && hubspotData.type === 'modal' && hubspotData.modalText) {
                    setTimeout(() => showModal(hubspotData.modalText), 100);
                }
            }
        }
    });
}

function showModal(text) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    if (modal && modalText) {
        modalText.innerHTML = text;
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

window.closeModal = closeModal;

function showFinish(win) {
    const finish = document.getElementById('finish');
    const finishMessage = document.getElementById('finish-message');
    if (finish && finishMessage) {
        finishMessage.textContent = win ? 'Vous avez gagné !' : 'Vous avez perdu !';
        finish.classList.add('active');
        finish.classList.toggle('win', win);
        finish.classList.toggle('lose', !win);
    }
}

const secretModal = document.getElementById('secret-modal');
const secretInput = document.getElementById('secret-input');
const secretPrompt = document.getElementById('secret-prompt');
const secretError = document.getElementById('secret-error');
const secretSubmit = document.getElementById('secret-submit');
const secretCancel = document.getElementById('secret-cancel');
let currentSecretHubspotData = null;

function checkSecret() {
    if (!currentSecretHubspotData) return;

    const inputValue = secretInput.value.trim();
    if (inputValue === currentSecretHubspotData.secretCode) {
        secretModal.classList.remove('active');
        if (currentSecretHubspotData.onSuccess) {
            const { type, action, modalText, win } = currentSecretHubspotData.onSuccess;
            switch (type) {
                case 'modal':
                    showModal(modalText || '');
                    break;
                case 'action':
                    if (action && getStateMachine().transition(action)) {
                        executeHubspotActions(currentSecretHubspotData);
                        updateHubspotsVisibility();
                    }
                    break;
                case 'finish':
                    if (action && getStateMachine().transition(action)) {
                        executeHubspotActions(currentSecretHubspotData);
                        updateHubspotsVisibility();
                    }
                    showFinish(win !== undefined ? win : true);
                    break;
                default:
                    if (currentSecretHubspotData.action && getStateMachine().transition(currentSecretHubspotData.action)) {
                        executeHubspotActions(currentSecretHubspotData);
                        updateHubspotsVisibility();
                    }
            }
        } else if (currentSecretHubspotData.action && getStateMachine().transition(currentSecretHubspotData.action)) {
            executeHubspotActions(currentSecretHubspotData);
            updateHubspotsVisibility();
        }
    } else {
        if (secretError) {
            secretError.textContent = 'Code incorrect';
            secretError.style.display = 'block';
        }
    }
}

export function initSecretInput() {
    secretSubmit.addEventListener('click', checkSecret);
    secretCancel.addEventListener('click', () => secretModal.classList.remove('active'));
    secretInput.addEventListener('keypress', (e) => e.key === 'Enter' && checkSecret());
}

function showSecretInput(hubspotData) {
    currentSecretHubspotData = hubspotData;
    secretPrompt.textContent = hubspotData.prompt || 'Entrez le code secret:';
    secretInput.value = '';
    if (secretError) {
        secretError.textContent = '';
        secretError.style.display = 'none';
    }
    secretModal.classList.add('active');
    secretInput.focus();
}