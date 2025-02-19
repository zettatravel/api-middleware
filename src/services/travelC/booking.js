import app from "../../../app.js";
import fetch from "node-fetch";

export class booking {

    //servicio para obetner todos los registros
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

            return response.json();

        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }
    }

// servicio para modificar los registro


//servicio para elminar los registros


}
