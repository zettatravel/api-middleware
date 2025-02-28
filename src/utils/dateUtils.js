/**
 * Formats a date into a YYYY-MM-DD string.
 *
 * @function formatDate
 * @param {string|Date} date - The date to format. Can be a string or a Date object.
 * @returns {string} The formatted date in YYYY-MM-DD format. Returns an empty string if no date is provided.
 *
 * @example
 * formatDate("2025-02-28T14:30:00Z"); // "2025-02-28"
 * formatDate(new Date()); // "2025-02-28" (depending on the current date)
 */

export const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Extrae solo YYYY-MM-DD
};