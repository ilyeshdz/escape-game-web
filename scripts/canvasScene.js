let canvas = null;
let ctx = null;
let sceneImage = null;
let hubspots = [];
let hoveredHubspotId = null;
let focusedHubspotIndex = -1;
let isKeyboardNavigating = false;

/**
 * Initializes the canvas scene with scene management
 * @param {HTMLCanvasElement} canvasElement - Canvas element to initialize
 * @param {Object} sceneConfig - Scene configuration object with backgroundImage property
 * @param {Array} hubspotsData - Array of hubspot data
 */
export function initCanvasScene(canvasElement, sceneConfig, hubspotsData) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    hubspots = hubspotsData;

    const imagePath = sceneConfig?.backgroundImage || 'assets/scene1.png';
    loadSceneImage(imagePath);
    setupEventListeners();
    requestAnimationFrame(renderLoop);
}

/**
 * Loads a scene by its configuration
 * @param {Object} sceneConfig - Scene configuration object
 */
export function loadScene(sceneConfig) {
    if (!sceneConfig) return;

    const imagePath = sceneConfig.backgroundImage || 'assets/scene1.png';
    loadSceneImage(imagePath);
}

/**
 * Gets the current scene image
 * @returns {Image} Current scene image object
 */
export function getSceneImage() {
    return sceneImage;
}

function loadSceneImage(path) {
    sceneImage = new Image();
    sceneImage.onload = () => {
        resizeCanvas();
    };
    sceneImage.onerror = () => {};
    sceneImage.src = path;
}

function resizeCanvas() {
    if (!canvas || !sceneImage) return;

    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const sceneAspectRatio = sceneImage.width / sceneImage.height;
    const containerAspectRatio = containerWidth / containerHeight;

    let renderWidth, renderHeight, offsetX, offsetY;

    if (containerAspectRatio > sceneAspectRatio) {
        renderHeight = containerHeight;
        renderWidth = renderHeight * sceneAspectRatio;
        offsetX = (containerWidth - renderWidth) / 2;
        offsetY = 0;
    } else {
        renderWidth = containerWidth;
        renderHeight = renderWidth / sceneAspectRatio;
        offsetX = 0;
        offsetY = (containerHeight - renderHeight) / 2;
    }

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    canvas.renderWidth = renderWidth;
    canvas.renderHeight = renderHeight;
    canvas.offsetX = offsetX;
    canvas.offsetY = offsetY;
}

function setupEventListeners() {
    if (!canvas) return;

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        hoveredHubspotId = getHubspotAtPosition(x, y);

        if (!isKeyboardNavigating) {
            canvas.style.cursor = hoveredHubspotId ? 'pointer' : 'default';
        }
    });

    canvas.addEventListener('click', () => {
        canvas.focus();
        if (hoveredHubspotId) {
            const hubspot = hubspots.find((h) => h.id === hoveredHubspotId);
            if (hubspot && hubspot.onClick) {
                hubspot.onClick(hubspot);
            }
        }
    });

    canvas.addEventListener('keydown', handleKeyboardNavigation);

    canvas.addEventListener('focus', () => {
        isKeyboardNavigating = false;
    });

    canvas.addEventListener('mousedown', () => {
        isKeyboardNavigating = false;
        canvas.classList.remove('keyboard-mode');
    });
}

function handleKeyboardNavigation(e) {
    const visibleHubspots = hubspots.filter((h) => !h.isHidden);

    if (visibleHubspots.length === 0) return;

    if (e.key === 'Tab') {
        e.preventDefault();
        isKeyboardNavigating = true;
        canvas.classList.add('keyboard-mode');

        if (focusedHubspotIndex < 0) {
            focusedHubspotIndex = 0;
        } else {
            const direction = e.shiftKey ? -1 : 1;
            focusedHubspotIndex =
                (focusedHubspotIndex + direction + visibleHubspots.length) % visibleHubspots.length;
        }

        const focusedHubspot = visibleHubspots[focusedHubspotIndex];
        if (focusedHubspot) {
            hoveredHubspotId = focusedHubspot.id;
        }
        renderHubspots();
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedHubspotIndex >= 0 && hoveredHubspotId) {
            const hubspot = hubspots.find((h) => h.id === hoveredHubspotId);
            if (hubspot && hubspot.onClick) {
                hubspot.onClick(hubspot);
            }
        }
    } else if (e.key === 'Escape') {
        isKeyboardNavigating = false;
        focusedHubspotIndex = -1;
        canvas.classList.remove('keyboard-mode');
        renderHubspots();
    }
}

function getHubspotAtPosition(x, y) {
    if (!hubspots.length || !canvas.renderWidth) return null;

    for (const hubspot of hubspots) {
        const hubspotX = (hubspot.x / 100) * canvas.renderWidth + canvas.offsetX;
        const hubspotY = (hubspot.y / 100) * canvas.renderHeight + canvas.offsetY;
        const size = getHubspotSize(hubspot);

        const dx = x - hubspotX;
        const dy = y - hubspotY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= size / 2) {
            return hubspot.id;
        }
    }

    return null;
}

function getHubspotSize(hubspot) {
    if (hubspot.size) return hubspot.size;

    const baseSize = 40;
    const minDimension = Math.min(canvas.renderWidth, canvas.renderHeight);
    const scaleFactor = minDimension / 1000;

    return Math.round(baseSize * Math.max(0.4, Math.min(1.5, scaleFactor)));
}

function getEmojiSize(hubspot) {
    const size = getHubspotSize(hubspot);
    return Math.max(12, Math.round(size * 0.5));
}

function renderLoop() {
    if (!ctx || !sceneImage) {
        requestAnimationFrame(renderLoop);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.offsetX, canvas.offsetY);
    ctx.drawImage(sceneImage, 0, 0, canvas.renderWidth, canvas.renderHeight);
    ctx.restore();

    renderHubspots();

    requestAnimationFrame(renderLoop);
}

function renderHubspots() {
    hubspots.forEach((hubspot) => {
        const x = (hubspot.x / 100) * canvas.renderWidth + canvas.offsetX;
        const y = (hubspot.y / 100) * canvas.renderHeight + canvas.offsetY;
        const size = getHubspotSize(hubspot);
        const isHovered = hoveredHubspotId === hubspot.id;

        if (hubspot.isHidden) return;

        if (hubspot.emoji) {
            const emojiSize = getEmojiSize(hubspot);
            ctx.font = `${emojiSize}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText(hubspot.emoji, x, y);

            if (isHovered) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = Math.max(1, size / 25);
                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.stroke();

                if (hubspot.tooltip) {
                    renderTooltip(x, y, hubspot.tooltip, size);
                }
            }
            return;
        }

        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();

        if (isHovered) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = Math.max(1.5, size / 20);
            ctx.stroke();

            if (hubspot.tooltip) {
                renderTooltip(x, y, hubspot.tooltip, size);
            }
        }
    });

    if (isKeyboardNavigating && focusedHubspotIndex >= 0) {
        const visibleHubspots = hubspots.filter((h) => !h.isHidden);
        const focusedHubspot = visibleHubspots[focusedHubspotIndex];

        if (focusedHubspot) {
            const x = (focusedHubspot.x / 100) * canvas.renderWidth + canvas.offsetX;
            const y = (focusedHubspot.y / 100) * canvas.renderHeight + canvas.offsetY;
            const size = getHubspotSize(focusedHubspot);

            ctx.beginPath();
            ctx.arc(x, y, size / 2 + 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = Math.max(2, size / 25);
            ctx.setLineDash([4, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

function renderTooltip(x, y, text, hubspotSize = 40) {
    const fontSize = Math.max(11, Math.min(14, Math.round(hubspotSize / 3)));
    ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
    const textMetrics = ctx.measureText(text);
    const padding = Math.max(6, Math.round(hubspotSize / 5));
    const tooltipWidth = Math.min(textMetrics.width + padding * 2, canvas.width - 20);
    const tooltipHeight = Math.max(20, fontSize + padding);

    const margin = 5;

    // Always display above the hubspot
    let tooltipX = x - tooltipWidth / 2;
    let tooltipY = y - hubspotSize / 2 - tooltipHeight - 8;

    // Adjust horizontal position if it overflows
    if (tooltipX < margin) {
        tooltipX = margin;
    } else if (tooltipX + tooltipWidth > canvas.width - margin) {
        tooltipX = canvas.width - tooltipWidth - margin;
    }

    // If tooltip overflows at the top, clamp it to the top margin
    if (tooltipY < margin) {
        tooltipY = margin;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.beginPath();
    roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 4);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight / 2);
}

function roundRect(x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
}

export function updateHubspots(newHubspots) {
    hubspots = newHubspots;
}
