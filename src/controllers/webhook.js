// Core application imports
import app from "../../app.js";

// Utility functions
import {logger} from "../utils/logUtils.js";
import {authenticateIfNeeded} from "../utils/authUtils.js";

// TravelC services
import {Bookings} from "../services/travelC/bookings.js";
import {AuthTravelC} from "../services/travelC/authTravelC.js";

// Handlers
import {handleCreate} from "./handlers/createBooking.js";

// Entities
import {Booking} from "../entities/travelC/booking.js";


export class webhookController {

    static async travelCBooking(req, res) {

        //recibir los datos del request
        const {micrositeId, bookingReference, type} = req.body;

        logger.info(`Webhook received from: ${micrositeId} - ${type}`);

        res.status(200).json({message: 'Webhook received'});

        //verificar que el microsite sea Zettatravel
        if (micrositeId !== process.env.TRAVELC_MICROSITE_ID) {
            logger.warn(`The microsite is different, the request has ended`);
            return null
        }

        //verificacion de autenticacion y autenticacion
        logger.debug(`Checking TravelC token expiration...`);
        await authenticateIfNeeded("TravelC", app.locals.timeTokenTravelC, () => AuthTravelC.auth(micrositeId));

        //realizar la busqueda de reserva y llamar constructor
        const bookingResponse = await Bookings.getBookings(bookingReference, micrositeId);
        const booking = new Booking(bookingResponse);
        logger.debug(`Booking Id: ${booking.id}`);

        // Verificar que la reserva (Booking) provenga de la agencia Zetta Travel Group
        if(booking.user.agency.externalId !== process.env.TRAVELC_EXTERNAL_ID){
            logger.warn(`The microsite external Id is different, the request has ended`)
            return null;
        }

        // Definir estrategias según el tipo de webhook
        const webhookActions = {
            CREATED: handleCreate,
            //MODIFIED: handleUpdate,
            //CANCELED: handleDelete
        };

        //realizar procedimiento segun tipo de operacion para ejecutar la acción correspondiente
        const action = webhookActions[type];
        if (action) {
            await action(booking);
        } else {
            logger.warn(`Unknown webhook type: ${type}`);
        }


        logger.info("Controller execution completed.");
    }
}