/**
 * Image Preloader Module
 * Handles preloading of background images
 */

/**
 * Preload images
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 * @returns {Promise<Array<string>>} Promise that resolves when all images are loaded
 */
export function preloadImages(imageUrls) {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
}

/**
 * Handle image load error
 * @param {string} imageUrl - Failed image URL
 * @param {string} careType - Care type identifier
 * @param {string} fallbackUrl - Fallback image URL
 * @returns {string} URL to use (fallback or null)
 */
export function handleImageLoadError(imageUrl, careType, fallbackUrl) {
  console.error(`Failed to load image for ${careType}: ${imageUrl}`);
  
  if (imageUrl !== fallbackUrl) {
    console.log(`Using fallback image: ${fallbackUrl}`);
    return fallbackUrl;
  }
  
  console.warn('All images failed to load, using solid background');
  return null;
}
