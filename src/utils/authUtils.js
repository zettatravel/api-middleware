import {logger} from "./logUtils.js";

/**
 * Authenticates a service if the token has expired.
 *
 * @async
 * @function authenticateIfNeeded
 * @param {string} serviceName - The name of the service to authenticate (e.g., "Zoho", "TravelC").
 * @param {number} tokenExpirationTime - The timestamp (in milliseconds) when the token expires.
 * @param {Function} authFunction - The function to call for authentication.
 *
 * @returns {Promise<void>} Resolves when authentication is checked or performed.
 *
 * @example
 * await authenticateIfNeeded("Zoho", app.locals.timeTokenZoho, AuthZoho.auth);
 */

export const authenticateIfNeeded = async (serviceName, tokenExpirationTime, authFunction) => {
    if (Date.now() >= tokenExpirationTime) {
        logger.debug(`${serviceName} token expired. Authenticating...`);
        try {
            await authFunction();
        } catch (error) {
            logger.error(`${serviceName} authentication failed.`, error);
        }
    } else {
        logger.debug(`${serviceName} token is still valid. Skipping authentication.`);
    }
};
