import fetch from "node-fetch";
import app from "../../../app.js";
import {logger} from "../../utils/logUtils.js";

export class Bookings {

    /**
     * Fetches booking details from the TravelC API.
     *
     * @param {string} bookingReference - The reference code of the booking.
     * @param {string} micrositeId - The microsite ID associated with the booking.
     * @returns {Promise<Object|null>} - The booking details or null if an error occurs.
     */
    static getBookings = async (bookingReference, micrositeId) => {
        try {
            logger.debug(`Fetching booking details for reference: ${bookingReference}`);
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
                logger.error(`Failed to fetch booking details. Status: ${response.status} - ${response.statusText}`);
                return null;
            }

            logger.info(`Booking details retrieved successfully.`);
            return response.json();

        } catch (error) {
            logger.error(`Error fetching booking details: ${error.message}`, { error });
            return null;
        }
    }

// servicio para modificar los registro

//servicio para elminar los registros

}
