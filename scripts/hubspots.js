import { getStateMachine } from './stateMachine.js';
import { loadHubspotsData } from './hubspotsData.js';
import { setFlag, unsetFlag, checkCondition } from './flags.js';
import { addItem, removeItem, getSelectedItemObject } from './inventory.js';
import { checkInventoryCondition } from './inventory.js';
import { updateHubspots as updateCanvasHubspots } from './canvasScene.js';

let hubspotsData = [];
let activeHubspots = [];
let currentSecretHubspotData = null;
const autoShownHubspots = new Set();

const hubspotHandlers = {
    area: handleAreaAction,
    modal: handleModalAction,
    action: handleAction,
    finish: handleFinishAction,
    link: handleLinkAction,
    secret: showSecretInput,
    useItem: handleUseItem,
};

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

export function getHubspots() {
    return activeHubspots;
}

function updateHubspotsVisibility() {
    const currentState = getStateMachine().getState();

    activeHubspots = hubspotsData
        .map(hubspotData => {
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
                return {
                    ...hubspotData,
                    onClick: (hubspot) => {
                        const type = hubspot.type || 'action';
                        const handler = hubspotHandlers[type];
                        if (handler) {
                            handler(hubspot);
                        }
                    }
                };
            }
            return null;
        })
        .filter(h => h !== null);

    updateCanvasHubspots(activeHubspots);

    activeHubspots.forEach(hubspotData => {
        if (hubspotData.autoShow && hubspotData.type === 'modal' && hubspotData.modalText && !autoShownHubspots.has(hubspotData.id)) {
            autoShownHubspots.add(hubspotData.id);
            setTimeout(() => showModal(hubspotData.modalText), 100);
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
    const finishSubtitle = document.getElementById('finish-subtitle');
    if (finish && finishMessage) {
        finishMessage.textContent = win ? 'Félicitations !' : 'Dommage...';
        if (finishSubtitle) {
            finishSubtitle.textContent = win
                ? 'Vous avez réussi à vous échapper !'
                : 'Peut-être une prochaine fois...';
        }
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
    const secretClose = document.getElementById('secret-close');
    const inspectClose = document.getElementById('inspect-close');
    
    secretSubmit.addEventListener('click', checkSecret);
    secretCancel.addEventListener('click', () => secretModal.classList.remove('active'));
    secretInput.addEventListener('keypress', (e) => e.key === 'Enter' && checkSecret());
    
    if (secretClose) {
        secretClose.addEventListener('click', () => secretModal.classList.remove('active'));
    }
    
    if (inspectClose) {
        inspectClose.addEventListener('click', () => {
            const modal = document.getElementById('item-inspect-modal');
            if (modal) modal.classList.remove('active');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            secretModal.classList.remove('active');
            const inspectModal = document.getElementById('item-inspect-modal');
            if (inspectModal) inspectModal.classList.remove('active');
        }
    });
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
