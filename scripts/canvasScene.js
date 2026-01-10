let canvas = null;
let ctx = null;
let sceneImage = null;
let hubspots = [];
let hoveredHubspotId = null;

export function initCanvasScene(canvasElement, imagePath, hubspotsData) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    hubspots = hubspotsData;

    loadSceneImage(imagePath);
    setupEventListeners();
    requestAnimationFrame(renderLoop);
}

function loadSceneImage(path) {
    sceneImage = new Image();
    sceneImage.onload = () => {
        resizeCanvas();
    };
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
        
        canvas.style.cursor = hoveredHubspotId ? 'pointer' : 'default';
    });

    canvas.addEventListener('click', (e) => {
        if (hoveredHubspotId) {
            const hubspot = hubspots.find(h => h.id === hoveredHubspotId);
            if (hubspot && hubspot.onClick) {
                hubspot.onClick(hubspot);
            }
        }
    });
}

function getHubspotAtPosition(x, y) {
    if (!hubspots.length || !canvas.renderWidth) return null;

    for (const hubspot of hubspots) {
        const hubspotX = (hubspot.x / 100) * canvas.renderWidth + canvas.offsetX;
        const hubspotY = (hubspot.y / 100) * canvas.renderHeight + canvas.offsetY;
        const size = (hubspot.size || 40);

        const dx = x - hubspotX;
        const dy = y - hubspotY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= size / 2) {
            return hubspot.id;
        }
    }

    return null;
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
    hubspots.forEach(hubspot => {
        const x = (hubspot.x / 100) * canvas.renderWidth + canvas.offsetX;
        const y = (hubspot.y / 100) * canvas.renderHeight + canvas.offsetY;
        const size = hubspot.size || 40;
        const isHovered = hoveredHubspotId === hubspot.id;

        if (hubspot.isHidden) return;

        if (hubspot.emoji) {
            ctx.font = `${size * 0.6}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText(hubspot.emoji, x, y);

            if (isHovered) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.stroke();

                if (hubspot.tooltip) {
                    renderTooltip(x, y, hubspot.tooltip);
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
            ctx.lineWidth = 3;
            ctx.stroke();
            
            if (hubspot.tooltip) {
                renderTooltip(x, y, hubspot.tooltip);
            }
        }
    });
}

function renderTooltip(x, y, text) {
    ctx.font = 'bold 14px Arial, Helvetica, sans-serif';
    const textMetrics = ctx.measureText(text);
    const padding = 12;
    const tooltipWidth = textMetrics.width + padding * 2;
    const tooltipHeight = 28;
    const tooltipX = x - tooltipWidth / 2;
    const tooltipY = y - 40;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.beginPath();
    roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 6);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, tooltipY + tooltipHeight / 2);
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
