import app from "../../../app.js";
import fetch from "node-fetch";
import {logger} from "../../utils/logUtils.js";

export class Leads {

    //servicio para obtener todos los leads

    /**
     * Retrieves a lead from Zoho CRM by email.
     * @param {string} email - The email address to search for.
     * @returns {Promise<object|null>} - The lead data or null if not found.
     */
    static getLeadByEmail = async (email) => {
        try {
            logger.debug(`Fetching lead with email: ${email} from Zoho CRM...`);
            const response = await fetch(`${process.env.ZOHO_BASE_URL}/v7/Leads/search?criteria=(Email:equals:${email})`, {
                method: 'GET',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });

            const responseText = await response.text();

            if (!response.ok || !responseText) {
                logger.warn(`No lead found with email: ${email}`);
                return null;
            }

            logger.info(`Lead retrieved successfully.`);
            return JSON.parse(responseText);
        } catch (error) {
            logger.error("Error fetching lead from Zoho CRM:", { error });
            return null;
        }
    }

    /**
     * Creates a new lead in Zoho CRM.
     * @param {object} newLead - The lead data to be created.
     * @returns {Promise<object|null>} - The response data or null if an error occurs.
     */
    static createLead = async (newLead) => {
        logger.debug("Start to create a new lead in Zoho CRM...");

        try {
            const response = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLead)
            });

            const responseData = await response.json();

            if (!response.ok || !responseData?.data?.length) {
                logger.error(`Failed to create lead. Status: ${response.status}. Response: ${JSON.stringify(responseData)}`);
                return null;
            }

            logger.info("Lead successfully created.");
            return responseData;

        } catch (error) {
            logger.error("Error while creating lead in Zoho CRM:", { error });
            return null;
        }
    }

    /**
     * Converts a lead into a deal in Zoho CRM.
     * @param {object} newDeal - The deal data to be created.
     * @param {string} leadId - The ID of the lead to convert.
     * @returns {Promise<object|null>} - The response data or null if an error occurs.
     */
    static convertLead = async (newDeal, leadId) => {
        try {
            logger.debug("Start to convert lead to deal...");
            const response = await fetch(`https://www.zohoapis.com/crm/v2/Leads/${leadId}/actions/convert`, {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(newDeal)
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error(`Convert lead failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
                return null;
            }

            const responseData = await response.json();
            logger.info(`Lead successfully converted. Response: ${JSON.stringify(responseData, null, 2)}`);
            return responseData;

        } catch (error) {
            logger.error(`convertLead encountered an error: ${error.message}`, {
                stack: error.stack,
                name: error.name,
                cause: error.cause || "No cause available",
            });
            return null;
        }
    }

}