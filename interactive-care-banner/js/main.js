/**
 * Main Module
 * Component initialization and public API
 */

import { StateManager, createInitialState } from './state.js';
import { updateButtonState, animateDropdown, switchBackgroundImage } from './ui.js';
import { setupButtonClickHandlers, setupKeyboardNavigation, setupResizeHandler } from './events.js';
import { preloadImages } from './preloader.js';
import { setupAccessibility, updateARIAAttributes } from './accessibility.js';

/**
 * Validate configuration object
 * @param {Object} config - Configuration object
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  const errors = [];
  
  if (!config.containerId) {
    errors.push('containerId is required');
  }
  
  if (!config.images || typeof config.images !== 'object') {
    errors.push('images configuration is required');
  } else {
    const requiredImages = ['default', 'independentLiving', 'assistedLiving', 'memoryCare'];
    requiredImages.forEach(key => {
      if (!config.images[key]) {
        errors.push(`images.${key} is required`);
      }
    });
  }
  
  if (!config.content || typeof config.content !== 'object') {
    errors.push('content configuration is required');
  } else {
    const requiredContent = ['independentLiving', 'assistedLiving', 'memoryCare'];
    requiredContent.forEach(key => {
      if (!config.content[key] || !config.content[key].title || !config.content[key].description) {
        errors.push(`content.${key} must have title and description`);
      }
    });
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
  
  return true;
}

/**
 * Render initial HTML structure
 * @param {string} containerId - Container element ID
 * @param {Object} config - Configuration object
 */
function renderHTML(containerId, config) {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container element not found: ${containerId}`);
  }
  
  container.innerHTML = `
    <div class="care-banner-container relative min-h-screen w-full">
      <div class="background-container fixed inset-0 -z-10">
        <div class="background-image active absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-100" style="background-image: url(${config.images.default})"></div>
      </div>
      <div class="content-wrapper relative z-10 container mx-auto px-4 py-16">
        <div class="button-container flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
          <button id="button-independent-living" class="care-button px-8 py-4 text-lg font-medium transition-all duration-300 ease-out bg-white/80 text-gray-800 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg" data-care-type="independent-living" aria-expanded="false" aria-controls="dropdown-independent-living">
            Independent Living
          </button>
          <button id="button-assisted-living" class="care-button px-8 py-4 text-lg font-medium transition-all duration-300 ease-out bg-white/80 text-gray-800 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg" data-care-type="assisted-living" aria-expanded="false" aria-controls="dropdown-assisted-living">
            Assisted Living
          </button>
          <button id="button-memory-care" class="care-button px-8 py-4 text-lg font-medium transition-all duration-300 ease-out bg-white/80 text-gray-800 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg" data-care-type="memory-care" aria-expanded="false" aria-controls="dropdown-memory-care">
            Memory Care
          </button>
        </div>
        <div class="dropdown-container">
          <div id="dropdown-independent-living" class="dropdown-panel overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0" role="region" aria-labelledby="button-independent-living" aria-hidden="true">
            <div class="dropdown-content px-8 py-6 bg-white/90 backdrop-blur-sm rounded-lg">
              <h3 class="text-2xl font-semibold mb-4">${config.content.independentLiving.title}</h3>
              <p class="text-lg leading-relaxed">${config.content.independentLiving.description}</p>
            </div>
          </div>
          <div id="dropdown-assisted-living" class="dropdown-panel overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0" role="region" aria-labelledby="button-assisted-living" aria-hidden="true">
            <div class="dropdown-content px-8 py-6 bg-white/90 backdrop-blur-sm rounded-lg">
              <h3 class="text-2xl font-semibold mb-4">${config.content.assistedLiving.title}</h3>
              <p class="text-lg leading-relaxed">${config.content.assistedLiving.description}</p>
            </div>
          </div>
          <div id="dropdown-memory-care" class="dropdown-panel overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0" role="region" aria-labelledby="button-memory-care" aria-hidden="true">
            <div class="dropdown-content px-8 py-6 bg-white/90 backdrop-blur-sm rounded-lg">
              <h3 class="text-2xl font-semibold mb-4">${config.content.memoryCare.title}</h3>
              <p class="text-lg leading-relaxed">${config.content.memoryCare.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize Interactive Care Banner component
 * @param {Object} config - Configuration object
 * @returns {Object} Public API
 */
export async function initCareBanner(config) {
  try {
    validateConfig(config);
    
    renderHTML(config.containerId, config);
    
    const initialState = createInitialState(config);
    const stateManager = new StateManager(initialState);
    
    if (config.preloadImages !== false) {
      const imageUrls = Object.values(config.images);
      try {
        await preloadImages(imageUrls);
        stateManager.setState({ imagesPreloaded: true });
        console.log('All images preloaded successfully');
      } catch (error) {
        console.error('Image preloading failed:', error);
      }
    }
    
    stateManager.subscribe((newState, previousState) => {
      const buttons = document.querySelectorAll('.care-button');
      buttons.forEach(button => {
        const careType = button.dataset.careType;
        const isActive = newState.activeButton === careType;
        updateButtonState(button, isActive);
        updateARIAAttributes(button, isActive);
        
        const dropdown = document.getElementById(`dropdown-${careType}`);
        if (dropdown) {
          if (isActive && previousState.activeButton !== careType) {
            animateDropdown(dropdown, true);
          } else if (!isActive && previousState.activeButton === careType) {
            animateDropdown(dropdown, false);
          }
        }
      });
      
      if (newState.activeButton && newState.activeButton !== previousState.activeButton) {
        const careTypeKey = newState.activeButton.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const imageUrl = newState.images[careTypeKey];
        if (imageUrl) {
          switchBackgroundImage(imageUrl);
        }
      } else if (!newState.activeButton && previousState.activeButton) {
        switchBackgroundImage(newState.images.default);
      }
    });
    
    setupButtonClickHandlers(stateManager);
    
    if (config.enableKeyboard !== false) {
      setupKeyboardNavigation(stateManager);
    }
    
    setupResizeHandler();
    setupAccessibility(stateManager);
    
    return {
      getState: () => stateManager.getState(),
      destroy: () => {
        const liveRegion = document.getElementById('care-banner-live-region');
        if (liveRegion) {
          liveRegion.remove();
        }
      }
    };
  } catch (error) {
    console.error('Failed to initialize Care Banner:', error);
    throw error;
  }
}

// Example usage with sample configuration
const sampleConfig = {
  containerId: 'care-banner-root',
  images: {
    default: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80',
    independentLiving: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
    assistedLiving: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1920&q=80',
    memoryCare: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80'
  },
  content: {
    independentLiving: {
      title: 'Independent Living',
      description: 'Enjoy an active, maintenance-free lifestyle with the freedom to come and go as you please. Our independent living communities offer resort-style amenities, engaging activities, and a vibrant social atmosphere.'
    },
    assistedLiving: {
      title: 'Assisted Living',
      description: 'Receive personalized care and support with daily activities while maintaining your independence. Our compassionate team is available 24/7 to provide assistance tailored to your unique needs.'
    },
    memoryCare: {
      title: 'Memory Care',
      description: 'Experience specialized care in a secure, nurturing environment designed for individuals with Alzheimer\'s and dementia. Our trained staff provides compassionate support and engaging programs to enhance quality of life.'
    }
  }
};

// Initialize component when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCareBanner(sampleConfig);
  });
} else {
  initCareBanner(sampleConfig);
}
