/**
 * Retries a function multiple times with a delay between each attempt.
 *
 * @async
 * @function retryPattern
 * @param {Function} fetchFunction - The function to be retried.
 * @param {Array} [params=[]] - Parameters to pass to `fetchFunction`.
 * @param {number} attempts - The number of retry attempts.
 * @param {number} timeOut - The delay (in milliseconds) between each retry attempt.
 * @returns {Promise<*>} - The result of `fetchFunction` if successful, otherwise `null` after exhausting all attempts.
 *
 * @example
 * async function getData(id) {
 *   return await fetch(`https://api.example.com/data/${id}`).then(res => res.json());
 * }
 *
 * const data = await retryPattern(getData, [123], 5, 3000);
 * console.log(data); // Logs fetched data or null if not found after retries.
 */
import {logger} from "./logUtils.js";

export async function retryPattern(fetchFunction, params = [], attempts, timeOut) {
    // Helper function to create a delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < attempts; i++) {
        logger.debug(`Waiting ${timeOut / 1000} seconds before retry...`);

        await delay(timeOut);

        const verificacion = await fetchFunction(...params);

        if (verificacion) {
            logger.info(`Record found in attempt ${i + 1}`);
            return verificacion;
        }
    }

    logger.warn('All retry attempts failed. No record found.');
    return null;
}
