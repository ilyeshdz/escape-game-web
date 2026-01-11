let toastContainer = null;

export function initToastSystem() {
    toastContainer = document.getElementById('toast-container');
}

export function showToast(message, type = 'info', duration = 2500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

export function showSuccess(message) {
    return showToast(message, 'success');
}

export function showError(message) {
    return showToast(message, 'error');
}

export function showInfo(message) {
    return showToast(message, 'info');
}

export function showHubspotNotification(hubspotData) {
    if (hubspotData.notificationMessage) {
        const type = hubspotData.notificationType || 'info';
        showToast(hubspotData.notificationMessage, type);
    }
}
