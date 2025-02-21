import fetch from "node-fetch";
import app from "../../../app.js";

export class Booking {

    //servicio para obtener todos los registros
    static getBookings = async (bookingReference, micrositeId) => {
        try {
            const response = await fetch(`${process.env.TRAVELC_BASE_URL}/booking/getBookings/${micrositeId}/${bookingReference}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'auth-token': app.locals.authTokenTravelC,
                    'Accept-Encoding': 'gzip, deflate, br',
                }
            })

            // se verifica que la respuesta no sea la correcta
            if (!response.ok) {
                console.error(`Error en la respuesta getBookings LEAD.JS: ${response.status} ${response.statusText}`);
                return null;
            }

            return response.json();

        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }
    }

// servicio para modificar los registro


//servicio para elminar los registros


}
