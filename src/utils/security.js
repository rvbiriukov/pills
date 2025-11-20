/**
 * Sanitizes user input to prevent injection attacks and ensure safe data storage.
 * Although this is a client-side app, this practice helps prevent XSS and future-proofs
 * the application if a backend is ever added.
 * 
 * @param {string} input - The raw input string
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        // Remove potential SQL injection characters (basic protection)
        .replace(/['";]/g, '')
        // Remove potential XSS characters
        .replace(/[<>]/g, '')
        // Remove control characters
        .replace(/[\x00-\x1F\x7F]/g, '')
        // Trim whitespace
        .trim();
};

/**
 * Validates if the input contains only safe characters for a medication name.
 * Allows letters, numbers, spaces, and basic punctuation (., - ( )).
 * 
 * @param {string} input - The input string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidMedicationName = (input) => {
    // Allow alphanumeric, spaces, and common medication punctuation
    // Rejects special characters that might be used in code injection
    const safePattern = /^[a-zA-Z0-9\s\-\.\(\)\u00C0-\u00FF]*$/;
    return safePattern.test(input);
};
