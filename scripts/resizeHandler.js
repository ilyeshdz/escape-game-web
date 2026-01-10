function getImageDimensions(scene) {
    const container = scene.parentElement;
    const containerRatio = container.clientWidth / container.clientHeight;
    const imageRatio = scene.naturalWidth / scene.naturalHeight;
    
    let width, height;
    if (containerRatio > imageRatio) {
        height = container.clientHeight;
        width = height * imageRatio;
    } else {
        width = container.clientWidth;
        height = width / imageRatio;
    }
    
    return { 
        width, 
        height,
        offsetX: (container.clientWidth - width) / 2,
        offsetY: (container.clientHeight - height) / 2
    };
}

function updateHubspotsPosition(scene) {
    const { width: imgWidth, height: imgHeight, offsetX, offsetY } = getImageDimensions(scene);
    
    document.querySelectorAll('.hubspot').forEach(hubspot => {
        const xPercent = parseFloat(hubspot.dataset.xPercent);
        const yPercent = parseFloat(hubspot.dataset.yPercent);
        
        const x = offsetX + (xPercent / 100) * imgWidth;
        const y = offsetY + (yPercent / 100) * imgHeight;
        
        hubspot.style.setProperty('--x', `${x}px`);
        hubspot.style.setProperty('--y', `${y}px`);
    });
}

function handleScroll(gameContainer) {
    const rect = gameContainer.getBoundingClientRect();
    const isFullyVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
    
    if (!isFullyVisible) {
        gameContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
}

export function setupResizeHandler() {
    const scene = document.getElementById('scene');
    const gameContainer = document.querySelector('.game-container');
    
    if (!scene || !gameContainer) return;

    const onResize = () => {
        updateHubspotsPosition(scene);
        handleScroll(gameContainer);
    };
    
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(gameContainer);
    
    const init = () => {
        updateHubspotsPosition(scene);
        handleScroll(gameContainer);
    };
    
    if (scene.complete) {
        init();
    } else {
        scene.addEventListener('load', init, { once: true });
    }
    
    window.addEventListener('resize', onResize);
    
    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', onResize);
    };
}
