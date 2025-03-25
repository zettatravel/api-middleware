import {logger} from "../../utils/logUtils.js";
import fetch from "node-fetch";
import app from "../../../app.js";

export class Contacts {

    static getContactByEmail = async (email) => {
        try {
            logger.debug(`Fetching Contact with email: ${email} from Zoho CRM...`);
            const response = await fetch(`${process.env.ZOHO_BASE_URL}/v7/Contacts/search?criteria=(Email:equals:${email})`, {
                method: 'GET',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });

            // Respuesta no existosa
            if (!response.ok) {
                logger.error(`Failed to fetch Contact. Status: ${response.status} - ${response.statusText}`);
                return null;
            }

            //respuesta a texto
            const responseText = await response.text();

            //si la respuesta es vacia
            if (!responseText) {
                logger.warn(`No Contact found with email: ${email}`);
                return null;
            }

            // Convertir a JSON solo si tiene contenido
            logger.info(`Contact retrieved successfully.`);
            return JSON.parse(responseText);

        } catch (error) {
            logger.error("Error fetching Contact from Zoho CRM:", {error});
            return null;
        }
    }
}