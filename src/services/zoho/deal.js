import fetch from "node-fetch";
import app from "../../../app.js";

export class Deal {

    //servicio para obtner todos los deals
    static getDeals = async (bookingReference, micrositeId) => {
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



}