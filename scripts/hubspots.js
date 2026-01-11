import { getStateMachine } from './stateMachine.js';
import { loadHubspotsData } from './hubspotsData.js';
import { setFlag, unsetFlag, checkCondition } from './flags.js';
import { addItem, removeItem, getSelectedItemObject } from './inventory.js';
import { checkInventoryCondition } from './inventory.js';
import { updateHubspots as updateCanvasHubspots } from './canvasScene.js';
import { showHubspotNotification } from './toast.js';

let hubspotsData = [];
let activeHubspots = [];
let currentSecretHubspotData = null;
const autoShownHubspots = new Set();
let lastFocusedElement = null;

const hubspotHandlers = {
    area: handleAreaAction,
    modal: handleModalAction,
    action: handleAction,
    finish: handleFinishAction,
    link: handleLinkAction,
    secret: showSecretInput,
    useItem: handleUseItem
};

function executeHubspotActions(hubspotData) {
    if (hubspotData.giveItems) {
        hubspotData.giveItems.forEach((item) => {
            if (addItem(item)) {
                if (item.pickupMessage) {
                    setTimeout(() => showModal(item.pickupMessage), 100);
                }
            }
        });
    }
    if (hubspotData.giveFlags) {
        hubspotData.giveFlags.forEach((flag) => {
            setFlag(flag);
        });
    }
    if (hubspotData.removeFlags) {
        hubspotData.removeFlags.forEach((flag) => {
            unsetFlag(flag);
        });
    }
    if (hubspotData.removeItems) {
        hubspotData.removeItems.forEach((itemId) => {
            removeItem(itemId);
        });
    }
}

function handleAreaAction(hubspotData) {
    if (hubspotData.modalText) showModal(hubspotData.modalText);
    if (hubspotData.url) window.open(hubspotData.url, '_blank');
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        showHubspotNotification(hubspotData);
        updateHubspotsVisibility();
        if (hubspotData.win !== undefined) {
            showFinish(hubspotData.win);
        }
    }
}

function handleModalAction(hubspotData) {
    if (hubspotData.notificationMessage) {
        executeHubspotActions(hubspotData);
        showHubspotNotification(hubspotData);
        updateHubspotsVisibility();
    } else {
        showModal(hubspotData.modalText || '');
        executeHubspotActions(hubspotData);
        showHubspotNotification(hubspotData);
        updateHubspotsVisibility();
    }
}

function handleAction(hubspotData) {
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        showHubspotNotification(hubspotData);
        updateHubspotsVisibility();
    }
}

function handleFinishAction(hubspotData) {
    if (hubspotData.action && getStateMachine().transition(hubspotData.action)) {
        executeHubspotActions(hubspotData);
        showHubspotNotification(hubspotData);
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
        showHubspotNotification(hubspotData);
        if (selectedItem.consumable) {
            removeItem(selectedItem.id);
        }
        updateHubspotsVisibility();
    }
}

export async function setupHubspots() {
    hubspotsData = await loadHubspotsData();
    if (hubspotsData.length === 0) {
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
        .map((hubspotData) => {
            const isVisibleInState = hubspotData.visibleIn.includes(currentState);
            const meetsConditions =
                checkCondition({
                    requireFlags: hubspotData.requireFlags,
                    requireAnyFlags: hubspotData.requireAnyFlags,
                    requireNotFlags: hubspotData.requireNotFlags
                }) &&
                checkInventoryCondition({
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
        .filter((h) => h !== null);

    updateCanvasHubspots(activeHubspots);

    activeHubspots.forEach((hubspotData) => {
        if (
            hubspotData.autoShow &&
            hubspotData.type === 'modal' &&
            hubspotData.modalText &&
            !autoShownHubspots.has(hubspotData.id)
        ) {
            autoShownHubspots.add(hubspotData.id);
            setTimeout(() => showModal(hubspotData.modalText), 100);
        }
    });
}

function showModal(text) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    const closeBtn = modal?.querySelector('.modal-close');

    if (modal && modalText) {
        lastFocusedElement = document.activeElement;
        modalText.innerHTML = text;
        modal.classList.add('active');
        closeBtn?.focus();
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }
}

window.closeModal = closeModal;

export function announce(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

function showFinish(win) {
    const finish = document.getElementById('finish');
    const finishMessage = document.getElementById('finish-message');
    const finishSubtitle = document.getElementById('finish-subtitle');
    const restartBtn = document.getElementById('restart-btn');
    if (finish && finishMessage) {
        lastFocusedElement = document.activeElement;
        finishMessage.textContent = win ? 'Félicitations !' : 'Dommage...';
        if (finishSubtitle) {
            finishSubtitle.textContent = win
                ? 'Vous avez réussi à vous échapper !'
                : 'Peut-être une prochaine fois...';
        }
        finish.classList.add('active');
        finish.classList.toggle('win', win);
        finish.classList.toggle('lose', !win);
        restartBtn?.focus();
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
                    if (
                        currentSecretHubspotData.action &&
                        getStateMachine().transition(currentSecretHubspotData.action)
                    ) {
                        executeHubspotActions(currentSecretHubspotData);
                        updateHubspotsVisibility();
                    }
            }
        } else if (
            currentSecretHubspotData.action &&
            getStateMachine().transition(currentSecretHubspotData.action)
        ) {
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
    secretCancel.addEventListener('click', () => {
        secretModal.classList.remove('active');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    });
    secretInput.addEventListener('keypress', (e) => e.key === 'Enter' && checkSecret());

    if (secretClose) {
        secretClose.addEventListener('click', () => {
            secretModal.classList.remove('active');
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        });
    }

    if (inspectClose) {
        inspectClose.addEventListener('click', () => {
            const modal = document.getElementById('item-inspect-modal');
            if (modal) {
                modal.classList.remove('active');
                if (lastFocusedElement) {
                    lastFocusedElement.focus();
                    lastFocusedElement = null;
                }
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            secretModal.classList.remove('active');
            const inspectModal = document.getElementById('item-inspect-modal');
            if (inspectModal) inspectModal.classList.remove('active');
            const finish = document.getElementById('finish');
            if (finish) finish.classList.remove('active');
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        }

        if (e.key === 'Tab') {
            const activeModal = document.querySelector('.modal.active');
            const finishActive = document.querySelector('.finish.active');
            const activeElement = activeModal || finishActive;
            if (!activeElement) return;

            const focusable = activeElement.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
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

export function initAccessibility() {
    const toggleHelp = document.getElementById('toggle-help');
    const helpPanel = document.getElementById('keyboard-help');

    if (toggleHelp && helpPanel) {
        toggleHelp.addEventListener('click', () => {
            const isHidden = helpPanel.hidden;
            helpPanel.hidden = !isHidden;
            toggleHelp.setAttribute('aria-expanded', isHidden);
        });

        document.addEventListener('click', (e) => {
            if (
                !toggleHelp.contains(e.target) &&
                !helpPanel.contains(e.target) &&
                !helpPanel.hidden
            ) {
                helpPanel.hidden = true;
                toggleHelp.setAttribute('aria-expanded', 'false');
            }
        });
    }

    initLandscapeWarning();
}

function initLandscapeWarning() {
    const warning = document.getElementById('landscape-warning');
    const dismissBtn = document.querySelector('.landscape-dismiss');

    if (!warning) return;

    const checkOrientation = () => {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isSmallScreen = window.innerWidth <= 600;
        const wasDismissed = sessionStorage.getItem('landscape-warning-dismissed');

        if (isLandscape && isSmallScreen && !wasDismissed) {
            warning.hidden = false;
            warning.setAttribute('aria-hidden', 'false');
        } else {
            warning.hidden = true;
            warning.setAttribute('aria-hidden', 'true');
        }
    };

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            warning.hidden = true;
            warning.setAttribute('aria-hidden', 'true');
            sessionStorage.setItem('landscape-warning-dismissed', 'true');
        });
    }

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
        setTimeout(checkOrientation, 100);
    });
}
