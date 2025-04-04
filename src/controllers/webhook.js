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
import {handleModify} from "./handlers/modifyBooking.js";
import {AuthZoho} from "../services/zoho/authZoho.js";
import {handleCancel} from "./handlers/cancelBooking.js";
import {Deal} from "../entities/zoho/deal.js";
import {Deals} from "../services/zoho/deals.js";


export class webhookController {

    static async travelCBooking(req, res) {

        //recibir los datos del request
        let {micrositeId, bookingReference, type} = req.body;

        logger.info(`Webhook received from: ${micrositeId} - ${type} - ${bookingReference}`);

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
            logger.warn(`The microsite external Id is different, the request has ended`);
            return null;
        }

        // Verificacion extra, si viene type: CREATED, pero ya existe EL Deal en zoho, cambiar a MODIFIED
        // 1. realizar proceso de zoho
        await authenticateIfNeeded("Zoho", app.locals.timeTokenZoho, AuthZoho.auth);
        // 2. buscar el Deal en zoho por booking reference
        logger.debug("Checking if deal exists...");
        let dealResponse = await Deals.getDealByBookingReference(booking.bookingReference);
        let deal = dealResponse ? new Deal(dealResponse) : null;
        if (deal){
            type = "MODIFIED" // se encontro un deal por ende se cambia el tipo de reserva generado en travelC
        } else {
            type = "CREATED"
        }

        // Definir estrategias según el tipo de webhook
        const webhookActions = {
            CREATED: handleCreate,
            MODIFIED: handleModify,
            CANCELED: handleCancel
        };

        //realizar procedimiento segun tipo de operacion para ejecutar la acción correspondiente
        const action = webhookActions[type];
        if (action) {

            //seguir con el proceso dependiendo el tipo
            await action(booking);
        } else {
            logger.warn(`Unknown webhook type: ${type}`);
        }

        logger.info("Controller execution completed.");
    }
}