import {logger} from "./logUtils.js";

export const authenticateIfNeeded = async (serviceName, tokenExpirationTime, authFunction) => {
    if (Date.now() >= tokenExpirationTime) {
        logger.debug(`${serviceName} token expired. Authenticating...`);
        try {
            await authFunction();
            logger.info(`${serviceName} authentication successful.`);
        } catch (error) {
            logger.error(`${serviceName} authentication failed.`, error);
        }
    } else {
        logger.debug(`${serviceName} token is still valid. Skipping authentication.`);
    }
};
