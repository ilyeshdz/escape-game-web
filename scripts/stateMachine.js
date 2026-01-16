/**
 * Finite state machine for managing game states
 */
class StateMachine {
    /**
     * @param {string} initialState - Initial state name
     * @param {Object} transitions - Object mapping states to their possible transitions
     */
    constructor(initialState, transitions) {
        this.currentState = initialState;
        this.transitions = transitions;
        this.currentScene = null;
        this.scenes = {};
        this.sceneTransitions = {};
    }

    /**
     * Attempts to transition to a new state based on action
     * @param {string} action - Action name to trigger transition
     * @returns {boolean} True if transition was successful
     */
    transition(action) {
        const nextState = this.transitions[this.currentState]?.[action];

        if (nextState) {
            this.currentState = nextState;
            return true;
        }

        return false;
    }

    /**
     * Gets the current state
     * @returns {string} Current state name
     */
    getState() {
        return this.currentState;
    }

    /**
     * Transitions to a new scene
     * @param {string} targetSceneId - Target scene ID to transition to
     * @returns {boolean} True if scene transition was successful
     */
    transitionToScene(targetSceneId) {
        if (!targetSceneId || !this.scenes[targetSceneId]) {
            return false;
        }

        // Check if scene transition is allowed from current scene
        const allowedTransitions = this.sceneTransitions[this.currentScene] || {};
        if (
            Object.keys(allowedTransitions).length > 0 &&
            !Object.values(allowedTransitions).includes(targetSceneId)
        ) {
            return false;
        }

        this.currentScene = targetSceneId;
        return true;
    }

    /**
     * Gets the current scene
     * @returns {string} Current scene ID
     */
    getScene() {
        return this.currentScene;
    }

    /**
     * Gets scene configuration by ID
     * @param {string} sceneId - Scene ID to look up
     * @returns {Object|null} Scene configuration object or null if not found
     */
    getSceneConfig(sceneId) {
        return this.scenes[sceneId] || null;
    }
}

let stateMachine = null;

/**
 * Initializes the state machine with configuration from JSON
 * @param {Object} config - Configuration object with initialState, initialScene, scenes, sceneTransitions, and transitions
 * @returns {StateMachine} Initialized state machine instance
 */
export function initStateMachine(config) {
    if (!config || !config.initialState || !config.transitions) {
        throw new Error('Invalid state machine configuration: missing initialState or transitions');
    }
    stateMachine = new StateMachine(config.initialState, config.transitions);

    // Initialize scene management if provided
    if (config.initialScene && config.scenes) {
        // Load scenes into state machine
        config.scenes.forEach((scene) => {
            stateMachine.scenes[scene.id] = scene;
        });

        // Set initial scene
        stateMachine.currentScene = config.initialScene;

        // Load scene transitions if provided
        if (config.sceneTransitions) {
            stateMachine.sceneTransitions = config.sceneTransitions;
        }
    } else {
        // Fallback for backward compatibility - create default scene
        stateMachine.scenes = {
            room1: { id: 'room1', backgroundImage: 'assets/scene1.png', default: true }
        };
        stateMachine.currentScene = 'room1';
        stateMachine.sceneTransitions = { room1: {} };
    }

    return stateMachine;
}

/**
 * Loads state machine configuration from JSON file
 * @returns {Promise<StateMachine>} Initialized state machine
 */
export async function loadStateMachine() {
    const response = await fetch('./data/gameConfig.json');
    if (!response.ok) {
        throw new Error(`Failed to load state machine config: ${response.statusText}`);
    }
    const config = await response.json();

    // Also load scenes from scenes.json if it exists
    try {
        const scenesResponse = await fetch('./data/scenes.json');
        if (scenesResponse.ok) {
            const scenesConfig = await scenesResponse.json();
            if (scenesConfig.scenes && scenesConfig.scenes.length > 0) {
                config.scenes = scenesConfig.scenes;
            }
        }
    } catch {
        // scenes.json not found, will use fallback
        /* eslint-disable no-console */
        console.warn('scenes.json not found, using default scene');
        /* eslint-enable no-console */
    }

    return initStateMachine(config);
}

/**
 * Gets the current state machine instance
 * @returns {StateMachine} Current state machine instance
 */
export function getStateMachine() {
    if (!stateMachine) {
        throw new Error('State machine not initialized. Call loadStateMachine() first.');
    }
    return stateMachine;
}
