import { logger } from "./logUtils.js";

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
 */
export async function retryPattern(fetchFunction, params = [], attempts, timeOut) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < attempts; i++) {
        logger.debug(`Waiting ${timeOut / 1000} seconds before retry...`);
        await delay(timeOut);

        const result = await fetchFunction(...params);

        if (result && Array.isArray(result) && result.length > 0) {
            logger.info(`Record found in attempt ${i + 1}`);
            return result;
        }
    }

    logger.warn('All retry attempts failed. No record found.');
    return null;
}
