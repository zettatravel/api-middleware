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

            return response.json();

        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }
    }


    //servicio para crear un Lead
    static createLead = async (data) => {
        try {
            const request = await fetch(`${process.env.ZOHO_BASE_URL}/v7/Leads`, {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_AUTH_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    data: [
                        {
                            Owner: {id: 6382205000000476001},
                            Full_Name: "Otoniel Vicente",
                            Phone: "5532956998",
                            Mobile: "611063910",
                            Designation: "Lead de Pueba de API",
                            Lead_Source: "Facebook",
                            Presupuesto: "10000",
                            Company: "Zetta",
                            Last_Name: "Dominguez Gonzalez",
                            Email: "test@gmail.com",
                            Website: "zetta.com",
                            Lead_Status: "New Leads",
                            Rating: "Active",
                            Secondary_Email: "oto@test.com",
                            Currency: "MXN",
                            Street: "Josefa",
                            State: "Zumpango",
                            Country: "México",
                            City: "Estado de Mexico",
                            Zip_Code: "55628",
                            Description: "Descripción del texto"
                        }
                    ]
                })


            });

            // Validar si la respuesta es exitosa
            if (!request.ok) {
                throw new Error(`HTTP Error! Status: ${request.status}`);
            }

            // Convertir la respuesta a JSON
            const responseData = await request.json();
            console.log('✅ Lead creado correctamente:', responseData);
            return responseData;

        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }

    }



    //servicio para convertir un lead


}