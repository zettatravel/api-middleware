/**
 * Converts a string to capitalized case, where the first letter of each word is uppercase.
 *
 * @function toCapitalizedCase
 * @param {string} str - The input string to be capitalized.
 * @returns {string} - The capitalized version of the string.
 *
 * @example
 * console.log(toCapitalizedCase("hello world")); // "Hello World"
 * console.log(toCapitalizedCase("JAVASCRIPT is by dEFAULT")); // "Javascript Is By Default"
 * console.log(toCapitalizedCase("")); // ""
 */

export function toCapitalizedCase(str) {
    if (!str) return "";

    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}