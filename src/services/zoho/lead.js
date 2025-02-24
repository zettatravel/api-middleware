import app from "../../../app.js";
import fetch from "node-fetch";

export class Lead {


    //servicio para obtener todos los leads



    //servicio para obtener Lead por correo
    static getLeadByEmail = async (email) => {
        try {
            const response = await fetch(`${process.env.ZOHO_BASE_URL}/v7/Leads/search?criteria=(Email:equals:${email})`, {
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
                console.error(`Error en la respuesta getLeadByEmail LEAD.JS: ${response.status} ${response.statusText}`);
                return null;
            }

            //respuesta a texto
            const responseText = await response.text();

            //si la respuesta es vacia
            if (!responseText) {
                console.error("No hay coincidencias de correo getLeadByEmail LEAD.JS");
                return null;
            }

            // Convertir a JSON solo si tiene contenido
            return JSON.parse(responseText);

        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }
    }

    //servicio para crear un Lead
    static createLead = async (newLead) => {
        console.log('app.locals.authTokenZoho LEAD.JS:', app.locals.authTokenZoho)

        try {
            const request = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLead)

            });

            // Validar si la respuesta es exitosa
            if (!request.ok) {
                console.error(`Error en la respuesta createLead LEAD.JS: ${request.status} ${request.statusText}`);
                return null;
            }

            // Convertir la respuesta a JSON
            const responseData = await request.json();
            console.log('Lead creado correctamente: ', JSON.stringify(responseData, null, 2));

            return responseData;


        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }

    }

    //servicio para convertir un lead
    static convertLead = async (newDeal,id_lead) => {
        console.log('app.locals.authTokenZoho LEAD.JS:', app.locals.authTokenZoho)

        try {
            const request = await fetch(`https://www.zohoapis.com/crm/v2/Leads/${id_lead}/actions/convert`, {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${app.locals.authTokenZoho}`,
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(newDeal)

            });

            // Validar si la respuesta es exitosa
            if (!request.ok) {
                console.error(`Error en la respuesta convertLead LEAD.JS: ${request.status} ${request.statusText}`);
                return null;
            }

            // Convertir la respuesta a JSON
            const responseData = await request.json();
            console.log('Deal creado correctamente: ', JSON.stringify(responseData, null, 2));

            return responseData;


        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }

    }

}