/**
 * Accessibility Module
 * Manages ARIA attributes and keyboard navigation
 */

/**
 * Update ARIA attributes for button and dropdown
 * @param {HTMLElement} button - Button element
 * @param {boolean} isExpanded - Whether dropdown is expanded
 */
export function updateARIAAttributes(button, isExpanded) {
  button.setAttribute('aria-expanded', isExpanded.toString());
  
  const dropdownId = button.getAttribute('aria-controls');
  const dropdown = document.getElementById(dropdownId);
  
  if (dropdown) {
    dropdown.setAttribute('aria-hidden', (!isExpanded).toString());
  }
}

/**
 * Set up accessibility features
 * @param {StateManager} stateManager - State manager instance
 */
export function setupAccessibility(stateManager) {
  const buttons = document.querySelectorAll('.care-button');
  buttons.forEach((button) => {
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    const careType = button.dataset.careType.replace(/-/g, ' ');
    button.setAttribute('aria-label', `View ${careType} information`);
  });
  
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';
  liveRegion.id = 'care-banner-live-region';
  document.body.appendChild(liveRegion);
  
  stateManager.subscribe((newState, previousState) => {
    if (newState.activeButton && newState.activeButton !== previousState.activeButton) {
      const careType = newState.activeButton.replace(/-/g, ' ');
      liveRegion.textContent = `${careType} information panel opened`;
    } else if (!newState.activeButton && previousState.activeButton) {
      liveRegion.textContent = 'Information panel closed';
    }
  });
}

/**
 * Manage focus for accessibility
 * @param {string|null} activeButton - Active button identifier
 */
export function manageFocus(activeButton) {
  if (activeButton) {
    const button = document.querySelector(`[data-care-type="${activeButton}"]`);
    if (button) {
      button.focus();
    }
  }
}
