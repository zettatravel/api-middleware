import fetch from "node-fetch";
import app from "../../../app.js";

export class Deal {

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



}