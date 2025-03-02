import fetch from "node-fetch";
import app from "../../../app.js";
import {logger} from "../../utils/logUtils.js";

export class AuthTravelC {

    /**
     * Authenticates with the TravelC API using provided credentials and microsite ID.
     *
     * @param {string} micrositeId - The ID of the microsite for authentication.
     * @returns {Promise<void>}
     */
    static auth = async (micrositeId) => {
        try {
            logger.debug(`Starting authentication process for microsite: ${micrositeId}`);
            const response = await fetch(`${process.env.TRAVELC_BASE_URL}/authentication/authenticate`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Accept-Encoding': 'gzip, deflate, br',
                    },
                    body: JSON.stringify({
                        username: process.env.USER_TRAVELC,
                        password: process.env.PASS_TRAVELC,
                        micrositeId: micrositeId
                    })
                });

            const data = await response.json();

            if (!response.ok) {
                logger.info(`Authentication failed: ${data.message || "Unknown error"}`);
                return null;
            }

            logger.info(` TravelC Authentication successful.`);

            app.locals.authTokenTravelC = data.token;
            app.locals.timeTokenTravelC = Date.now() + (data.expirationInSeconds * 1000 ) - (600 * 1000);

        } catch (error) {
            logger.error(`Authentication failed: ${error.message}`, { error });
            return null;
        }
    }


}

