/**
 * State Management Module
 * Implements observer pattern for reactive state updates
 */

export class StateManager {
  constructor(initialState) {
    this.state = initialState;
    this.observers = [];
  }

  /**
   * Subscribe to state changes
   * @param {Function} observer - Callback function to be called on state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(observer) {
    if (typeof observer !== 'function') {
      throw new TypeError('Observer must be a function');
    }
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  /**
   * Update state and notify observers
   * @param {Object} updates - Partial state updates
   */
  setState(updates) {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...updates };
    this.notify(previousState, this.state);
  }

  /**
   * Notify all observers of state changes
   * @param {Object} previousState - State before update
   * @param {Object} newState - State after update
   */
  notify(previousState, newState) {
    this.observers.forEach(observer => {
      try {
        observer(newState, previousState);
      } catch (error) {
        console.error('Error in state observer:', error);
      }
    });
  }

  /**
   * Get current state (immutable copy)
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }
}

/**
 * Create initial state object
 * @param {Object} config - Configuration object
 * @returns {Object} Initial state
 */
export function createInitialState(config) {
  return {
    activeButton: null,
    previousButton: null,
    images: config.images,
    content: config.content,
    isAnimating: false,
    imagesPreloaded: false
  };
}
