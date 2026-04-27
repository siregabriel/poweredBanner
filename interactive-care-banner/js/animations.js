/**
 * Animation Module
 * Handles smooth transitions and animation controllers
 */

/**
 * Smooth transition using requestAnimationFrame
 * @param {HTMLElement} element - Element to animate
 * @param {string} property - CSS property to animate
 * @param {number} targetValue - Target value
 * @param {number} duration - Animation duration in milliseconds
 */
export function smoothTransition(element, property, targetValue, duration = 300) {
  let start = null;
  const startValue = parseFloat(getComputedStyle(element)[property]);
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = startValue + (targetValue - startValue) * easeOut;
    
    element.style[property] = `${currentValue}px`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Handle animation interruption
 * @param {HTMLElement} element - Element with interrupted animation
 */
export function handleAnimationInterruption(element) {
  element.style.transition = 'none';
  element.offsetHeight; // Trigger reflow
  element.style.transition = '';
}
