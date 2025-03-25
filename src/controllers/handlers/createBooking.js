// Core application imports
import app from "../../../app.js";

// Utility functions
import {retryPattern} from "../../utils/retryUtils.js";
import {logger} from "../../utils/logUtils.js";
import {authenticateIfNeeded} from "../../utils/authUtils.js";

// Zoho services
import {AuthZoho} from "../../services/zoho/authZoho.js";
import {Deals} from "../../services/zoho/deals.js";
import {Leads} from "../../services/zoho/leads.js";
import {Owners} from "../../services/zoho/owners.js";

// Data mapping
import {mapBookingToLead} from "../../mappers/zoho/leadMapping.js";
import {mapBookingToDeal} from "../../mappers/zoho/dealMapping.js";

// Entities
import {Lead} from "../../entities/zoho/lead.js";


export const handleCreate = async (booking) => {
    logger.info("Handling booking creation...");
    // Lógica para crear lead y convertir a deal
    //almacenar el correo del lead de la reserva
    const leadEmail = booking.contactPerson.email;
    logger.debug(`Lead email: ${leadEmail}`);

    //almacenar el correo del Owner o de quien realiza la reserva
    const OwnerEmail = booking.user.email;
    logger.debug(`Owner email: ${OwnerEmail}`);

    //realizar proceso de zoho
    await authenticateIfNeeded("Zoho", app.locals.timeTokenZoho, AuthZoho.auth);

    // Creacion de la variable Owner Id para recuperar el id del Owner
    logger.debug("recovering Owner ID...");
    const OwnerId = await Owners.getOwner(OwnerEmail)
    logger.debug(`Owner ID: ${OwnerId}`);

    //Realizar la busqueda del lead por email
    logger.debug("Checking if lead exists...");
    let leadResponse = await Leads.getLeadByEmail(leadEmail);
    let lead = leadResponse ? new Lead(leadResponse) : null;


    //verificacion del lead (si existe)
    if (!leadResponse) {
        logger.debug("Lead not found. Creating a new lead...");

        // creacion del mapeo para insertar el new lead
        const newLead = mapBookingToLead(booking, OwnerId);
        logger.debug(`New Lead mapped: ${newLead.data[0].First_Name}`);

        //Creacion del nevo Lead
        try {
            logger.debug("Creating new lead...");
            lead = await Leads.createLead(newLead)

            // verificacion de creacion de lead, mediante el patron "retry pattern"
            logger.debug("Verifying lead creation...");
            leadResponse = await retryPattern(Leads.getLeadByEmail, [leadEmail], 6, 30000);
            lead = leadResponse ? new Lead(leadResponse) : null;

        } catch (error) {
            logger.error("Failed to create lead.", error);
        }
    }

    //se muestra en consola el id del Lead
    logger.debug(`Lead ID: ${lead[0].id}`);

    // una vez creado el lead y verificado correctamente se procede a realizar la conversion a deal
    // creacion del mapeo para convertir lead a deal
    const newDeal = mapBookingToDeal(booking, OwnerId, lead)
    logger.debug(`New deal mapped: ${newDeal.data[0].Deals.Deal_Name}`);

    try {
        // creacion del deal
        logger.debug("Converting lead to deal...");
        const deal = await Leads.convertLead(newDeal, lead[0].id);

        logger.debug("Verifying convertion lead to deal...");
        await retryPattern(Deals.getDealByEmail, [deal.data[0].Deals.toString()], 6, 10000);

    } catch (error) {
        logger.error("Failed to convert deal.", error);
    }
};
