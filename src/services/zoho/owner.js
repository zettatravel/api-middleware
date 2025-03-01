import app from "../../../app.js";
import {logger} from "../../utils/logUtils.js";

export class Owner {

    /**
     * Retrieves the Zoho CRM user ID based on the given email.
     * @param {string} email - The email of the user.
     * @returns {Promise<string|null>} - The user ID or null if not found.
     */

    static getOwner = async(email) => {
        try{
            logger.debug("Fetching Zoho CRM owner by email...", { email });
            const response = await fetch(`https://www.zohoapis.com/crm/v2/users?type=ActiveUsers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            })

            // Respuesta no existosa
            if (!response.ok) {
                logger.error(`Failed to fetch users. Status: ${response.status} - ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            const user = data.users?.find(user => user.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                logger.warn("No matching user found in Zoho CRM.", { email });
                return null;
            }

            logger.info("User found in Zoho CRM.");
            return user.id;

        } catch (error) {
            logger.error("Error fetching user from Zoho CRM.", { error });
            return null;
        }

    }

}
