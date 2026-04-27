/**
 * Event Handling Module
 * Manages user interactions and event listeners
 */

/**
 * Set up button click handlers
 * @param {StateManager} stateManager - State manager instance
 */
export function setupButtonClickHandlers(stateManager) {
  const buttons = document.querySelectorAll('.care-button');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleButtonClick(button, stateManager);
    });
  });
}

/**
 * Handle button click event
 * @param {HTMLElement} button - Clicked button element
 * @param {StateManager} stateManager - State manager instance
 */
function handleButtonClick(button, stateManager) {
  const careType = button.dataset.careType;
  const currentState = stateManager.getState();
  
  if (currentState.isAnimating) return;
  
  const newActiveButton = currentState.activeButton === careType ? null : careType;
  
  stateManager.setState({
    previousButton: currentState.activeButton,
    activeButton: newActiveButton,
    isAnimating: true
  });
  
  setTimeout(() => {
    stateManager.setState({ isAnimating: false });
  }, 300);
}

/**
 * Set up keyboard navigation
 * @param {StateManager} stateManager - State manager instance
 */
export function setupKeyboardNavigation(stateManager) {
  const buttons = document.querySelectorAll('.care-button');
  
  buttons.forEach((button, index) => {
    button.addEventListener('keydown', (event) => {
      handleKeyboardEvent(event, button, buttons, index, stateManager);
    });
  });
}

/**
 * Handle keyboard event
 * @param {KeyboardEvent} event - Keyboard event
 * @param {HTMLElement} button - Current button
 * @param {NodeList} buttons - All buttons
 * @param {number} index - Current button index
 * @param {StateManager} stateManager - State manager instance
 */
function handleKeyboardEvent(event, button, buttons, index, stateManager) {
  switch(event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      button.click();
      break;
      
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      const nextButton = buttons[(index + 1) % buttons.length];
      nextButton.focus();
      break;
      
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      const prevButton = buttons[(index - 1 + buttons.length) % buttons.length];
      prevButton.focus();
      break;
      
    case 'Escape':
      if (stateManager.getState().activeButton) {
        stateManager.setState({ activeButton: null });
      }
      break;
  }
}

/**
 * Set up responsive resize handler
 */
export function setupResizeHandler() {
  const handleResize = debounce(() => {
    recalculateDropdownHeights();
  }, 150);
  
  window.addEventListener('resize', handleResize);
}

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Recalculate dropdown heights on resize
 */
function recalculateDropdownHeights() {
  const dropdowns = document.querySelectorAll('.dropdown-panel');
  dropdowns.forEach(dropdown => {
    if (dropdown.classList.contains('opacity-100')) {
      dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
    }
  });
}
