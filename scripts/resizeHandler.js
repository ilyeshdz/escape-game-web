function handleScroll(gameContainer) {
    const rect = gameContainer.getBoundingClientRect();
    const isFullyVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;

    if (!isFullyVisible) {
        gameContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
}

export function setupResizeHandler() {
    const gameContainer = document.querySelector('.game-container');

    if (!gameContainer) return undefined;

    const onResize = () => {
        handleScroll(gameContainer);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(gameContainer);

    const init = () => {
        handleScroll(gameContainer);
    };

    init();
    window.addEventListener('resize', onResize);

    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', onResize);
    };
}
