import app from "../../../app.js";

export class Owner {

    static getOwner = async(email) => {

        try{
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
                console.error(`Error en la respuesta getLeadByEmail LEAD.JS: ${response.status} ${response.statusText}`);
                return null;
            }

            const data = await response.json();

            console.log(email)

            // Filtrar Owner para obtener id
            const user = data.users.find(user => user.email === email.toLowerCase());
            return user ? user.id : null;


        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }

    }

}
