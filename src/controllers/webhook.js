// Core application imports
import app from "../../app.js";

// Utility functions
import {retryPattern} from "../utils/retryUtils.js";
import {logger} from "../utils/logUtils.js";
import {authenticateIfNeeded} from "../utils/authUtils.js";

// TravelC services
import {Bookings} from "../services/travelC/bookings.js";
import {AuthTravelC} from "../services/travelC/authTravelC.js";

// Zoho services
import {AuthZoho} from "../services/zoho/authZoho.js";
import {Deal} from "../services/zoho/deal.js";
import {Lead} from "../services/zoho/lead.js";
import {Owner} from "../services/zoho/owner.js";

// Data mapping
import {mapBookingToLead} from "../mappers/zoho/leadMapping.js";
import {mapBookingToDeal} from "../mappers/zoho/dealMapping.js";

export class webhookController {

    static async travelCBooking(req, res) {

        //recibir los datos del request
        const {micrositeId, bookingReference, type} = req.body;
        logger.info(`Webhook received from: ${micrositeId}`);

        //verificar que el microsite sea Zettatravel
        if (micrositeId !== 'zettatravel') {
            logger.info(`The microsite is different, the request has ended`)
            return res.status(200).json({message: 'Webhook received'});
        }

        res.status(200).json({message: 'Webhook received'});
        logger.debug(`Checking TravelC token expiration...`);

        //verificacion de autenticacion y autenticacion
        await authenticateIfNeeded("TravelC", app.locals.timeTokenTravelC, () => AuthTravelC.auth(micrositeId));

        //realizar la busqueda de reserva
        const booking = await Bookings.getBookings(bookingReference, micrositeId);
        logger.debug(`Boojing Id: ${booking.id}`);

        //almacenar el correo del lead de la reserva
        const leadEmail = booking.contactPerson.email.toString().toLowerCase()
        logger.debug(`Lead email: ${leadEmail}`);

        //almacenar el correo del Owner o de quien realiza la reserva
        const OwnerEmail = booking.user.email.toString().toLowerCase()
        logger.debug(`Owner email: ${OwnerEmail}`);

        //realizar proceso de zoho
        await authenticateIfNeeded("Zoho", app.locals.timeTokenZoho, AuthZoho.auth);

        // Creacion de la variable Owner Id para recuperar el id del Owner
        logger.debug("recovering Owner ID...");
        const OwnerId = await Owner.getOwner(OwnerEmail)
        logger.debug(`Owner ID: ${OwnerId}`);

        //Realizar la busqueda del lead por email
        logger.debug("Checking if lead exists...");
        let lead = await Lead.getLeadByEmail(leadEmail);

        //verificacion del lead (si existe)
        if (!lead) {
            logger.debug("Lead not found. Creating a new lead...");

            // creacion del mapeo para insertar el new lead
            const newLead = mapBookingToLead(booking, OwnerId);
            logger.debug(`New Lead mapped: ${newLead.data[0].First_Name}`);

            //Creacion del nevo Lead
            try {
                logger.debug("Creating new lead...");
                lead = await Lead.createLead(newLead)

                // verificacion de creacion de lead, mediante el patron "retry pattern"
                logger.debug("Verifying lead creation...");
                lead = await retryPattern(Lead.getLeadByEmail, [leadEmail], 6, 30000);

            } catch (error) {
                logger.error("Failed to create lead.", error);
            }
        }

        //se muestra en consola el id del Lead
        logger.debug(`Lead ID: ${lead.data[0].id}`);

        // una vez creado el lead y verificado correctamente se procede a realizar la conversion a deal
        // creacion del mapeo para convertir lead a deal
        const newDeal = mapBookingToDeal(booking, OwnerId, lead)
        logger.debug(`New deal mapped: ${newDeal.data[0].Deals.Deal_Name}`);

        try {
            // creacion del deal
            logger.debug("Converting lead to deal...");
            const deal = await Lead.convertLead(newDeal, lead.data[0].id);

            logger.debug("Verifying convertion lead to deal...");
            await retryPattern(Deal.getDealByEmail, [deal.data[0].Deals.toString()], 6, 10000);

        } catch (error) {
            logger.error("Failed to convert deal.", error);
        }

        logger.info("Controller execution completed.");
    }
}