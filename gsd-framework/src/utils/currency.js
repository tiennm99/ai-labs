/**
 * Convert dollar string to integer cents.
 * @param {string} dollars - Dollar amount as string (e.g., "15.99")
 * @returns {number} Cents as integer (e.g., 1599)
 */
export function dollarsToCents(dollars) {
  return Math.round(parseFloat(dollars) * 100);
}

/**
 * Convert cents to dollar string.
 * @param {number} cents - Cents as integer
 * @returns {string} Dollar string with 2 decimal places
 */
export function centsToDollars(cents) {
  return (cents / 100).toFixed(2);
}

/**
 * Format cents as currency string with $ prefix.
 * @param {number} cents - Cents as integer
 * @returns {string} Formatted currency (e.g., "$15.99")
 */
export function formatCurrency(cents) {
  return `$${centsToDollars(cents)}`;
}
