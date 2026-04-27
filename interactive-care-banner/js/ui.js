/**
 * UI Rendering Module
 * Handles DOM manipulation and visual updates
 */

/**
 * Update button visual state
 * @param {HTMLElement} button - Button element
 * @param {boolean} isActive - Whether button is active
 */
export function updateButtonState(button, isActive) {
  if (isActive) {
    button.classList.remove('bg-white/80', 'text-gray-800');
    button.classList.add('bg-white', 'text-gray-900', 'shadow-xl', 'scale-105');
  } else {
    button.classList.remove('bg-white', 'text-gray-900', 'shadow-xl', 'scale-105');
    button.classList.add('bg-white/80', 'text-gray-800');
  }
}

/**
 * Animate dropdown panel
 * @param {HTMLElement} dropdown - Dropdown element
 * @param {boolean} isOpening - Whether dropdown is opening
 */
export function animateDropdown(dropdown, isOpening) {
  if (isOpening) {
    dropdown.style.maxHeight = '0px';
    dropdown.classList.remove('opacity-0');
    dropdown.setAttribute('aria-hidden', 'false');
    
    dropdown.offsetHeight; // Trigger reflow
    
    const contentHeight = dropdown.scrollHeight;
    dropdown.style.maxHeight = `${contentHeight}px`;
    dropdown.classList.add('opacity-100');
  } else {
    dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
    
    dropdown.offsetHeight; // Trigger reflow
    
    dropdown.style.maxHeight = '0px';
    dropdown.classList.remove('opacity-100');
    dropdown.classList.add('opacity-0');
    dropdown.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Switch background image with crossfade
 * @param {string} imageUrl - URL of new background image
 */
export function switchBackgroundImage(imageUrl) {
  const container = document.querySelector('.background-container');
  const activeImage = container.querySelector('.background-image.active');
  
  const newImage = document.createElement('div');
  newImage.className = 'background-image absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-0';
  newImage.style.backgroundImage = `url(${imageUrl})`;
  
  container.appendChild(newImage);
  
  requestAnimationFrame(() => {
    newImage.classList.remove('opacity-0');
    newImage.classList.add('opacity-100', 'active');
    if (activeImage) {
      activeImage.classList.remove('active', 'opacity-100');
      activeImage.classList.add('opacity-0');
    }
  });
  
  setTimeout(() => {
    if (activeImage && activeImage.parentNode) {
      activeImage.remove();
    }
  }, 500);
}
