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
    }

    /**
     * Attempts to transition to a new state based on action
     * @param {string} action - Action name to trigger transition
     * @returns {boolean} True if transition was successful
     */
    transition(action) {
        const nextState = this.transitions[this.currentState]?.[action];
        console.log(`[StateMachine] Transition attempt: ${this.currentState} --[${action}]--> ${nextState || 'FAILED'}`);
        
        if (nextState) {
            const oldState = this.currentState;
            this.currentState = nextState;
            console.log(`[StateMachine] ✓ State changed: ${oldState} → ${nextState}`);
            return true;
        }
        
        console.warn(`[StateMachine] ✗ Transition failed: No transition from "${this.currentState}" with action "${action}"`);
        return false;
    }

    /**
     * Gets the current state
     * @returns {string} Current state name
     */
    getState() {
        return this.currentState;
    }
}

let stateMachine = null;

/**
 * Initializes the state machine with configuration from JSON
 * @param {Object} config - Configuration object with initialState and transitions
 * @returns {StateMachine} Initialized state machine instance
 */
export function initStateMachine(config) {
    if (!config || !config.initialState || !config.transitions) {
        throw new Error('Invalid state machine configuration: missing initialState or transitions');
    }
    stateMachine = new StateMachine(config.initialState, config.transitions);
    console.log(`[StateMachine] Initialized with state: ${config.initialState}`);
    return stateMachine;
}

/**
 * Loads state machine configuration from JSON file
 * @returns {Promise<StateMachine>} Initialized state machine
 */
export async function loadStateMachine() {
    try {
        const response = await fetch('./data/gameConfig.json');
        if (!response.ok) {
            throw new Error(`Failed to load state machine config: ${response.statusText}`);
        }
        const config = await response.json();
        return initStateMachine(config);
    } catch (error) {
        console.error('[StateMachine] Error loading configuration:', error);
        throw error;
    }
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