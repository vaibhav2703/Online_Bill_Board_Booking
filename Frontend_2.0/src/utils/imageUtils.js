/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Normalizes the image path to construct a proper URL
 * Handles cases where the backend might return:
 * - Just the filename: "1234_image.png"
 * - Path with uploads prefix: "uploads/1234_image.png" or "uploads\\1234_image.png"
 * - Full path with duplicate uploads: "uploads/uploads/1234_image.png"
 * 
 * @param {string} imagePath - The image path from the backend
 * @returns {string} - The normalized full URL to the image
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return null;
    }

    // Remove any leading/trailing whitespace
    imagePath = imagePath.trim();

    //console.log('Original image path:', imagePath);

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it's a base64 data URL, return as is
    if (imagePath.startsWith('data:image')) {
        return imagePath;
    }

    // CRITICAL: Convert Windows backslashes to forward slashes
    // Backend on Windows returns paths like "uploads\\filename.png"
    imagePath = imagePath.replace(/\\/g, '/');

    //console.log('After backslash conversion:', imagePath);

    // Remove any leading slashes
    imagePath = imagePath.replace(/^\/+/, '');

    // Remove ALL instances of "uploads/" prefix (handles duplicates)
    // This regex will match "uploads/" one or more times at the start
    imagePath = imagePath.replace(/^(uploads\/)+/, '');

    //console.log('Cleaned image path:', imagePath);

    // Construct the final URL with a single /uploads/ path
    const finalUrl = `${API_BASE_URL}/uploads/${imagePath}`;
    //console.log('Final URL:', finalUrl);

    return finalUrl;
};

/**
 * Gets a placeholder image URL
 * @returns {string} - URL to a placeholder image
 */
export const getPlaceholderImage = () => {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
};
