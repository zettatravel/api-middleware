import fetch from "node-fetch";
import app from "../../../app.js";
import {logger} from "../../utils/logUtils.js";

export class Deals {

    //servicio para crear un deal

    static createDeal = async (newDeal) => {
        logger.debug("Start to create a new deal in Zoho CRM...");

        try {
            const response = await fetch('https://www.zohoapis.com/crm/v2/Deals', {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDeal)

            });

            // Validar si la respuesta es exitosa
            if (!response.ok) {
                logger.error(`Failed to create deal. Status: ${response.status} - ${response.statusText}`);
                return null;
            }

            // Convertir la respuesta a JSON
            const responseData = await response.json();
            logger.info("Deal successfully created.");

            return responseData;

        } catch (error) {
            logger.error("Error while creating Deal in Zoho CRM:", { error });
            return null;
        }

    }

    //servicio para obtner todos los deals
    static getDeals = async () => {
        try {
            const response = await fetch('https://www.zohoapis.com/crm/v2/Deals', {
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
                console.error(`Error en la respuesta getDeals DEAL.JS: ${response.status} ${response.statusText}`);
                return null;
            }
/*
            const data = await response.json();

            // Filtrar deal para obtener el objeto
            const deal = data.deals.find(user => deal.email === deal.toLowerCase());
            return deal ? deal.id : null;
*/

            return await response.json();

        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }
    }

    /**
     * Retrieves a deal from Zoho CRM by its ID.
     * @param {string} id - The deal ID to search for.
     * @returns {Promise<object|null>} - The deal data or null if not found.
     */
    static getDealById = async (id) => {
        logger.debug(`Fetching deal with ID: ${id} from Zoho CRM...`);
        try {

            const response = await fetch(`${process.env.ZOHO_BASE_URL}/v2/Deals/search?criteria=(id:equals:${id})`, {
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
                logger.error(`Failed to fetch deal. Status: ${response.status} - ${response.statusText}`);
                return null;
            }

            //respuesta a texto
            const responseText = await response.text();

            //si la respuesta es vacia
            if (!responseText) {
                logger.warn(`No deal found with ID: ${id}`);
                return null;
            }

            // Convertir a JSON solo si tiene contenido
            logger.info(`Deal retrieved successfully.`);
            return JSON.parse(responseText);

        } catch (error) {
            logger.error("Error fetching deal from Zoho CRM:", { error });
            return null;
        }
    }

}