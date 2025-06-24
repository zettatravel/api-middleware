// Utility functions
import { retryPattern } from "../../utils/retryUtils.js";
import { logger } from "../../utils/logUtils.js";

// Zoho services
import { Deals } from "../../services/zoho/deals.js";
import { Leads } from "../../services/zoho/leads.js";
import { Owners } from "../../services/zoho/owners.js";
import { Contacts } from "../../services/zoho/contact.js";

// Data mapping
import { mapBookingToLead } from "../../mappers/zoho/leadMapping.js";
import {
    mapBookingAndContactToDeal,
    mapBookingAndLeadToDeal
} from "../../mappers/zoho/dealMapping.js";

// Entities
import { Lead } from "../../entities/zoho/lead.js";
import { Contact } from "../../entities/zoho/contact.js";

export const handleCreate = async (booking) => {
    logger.info("Handling booking creation...");

    const leadEmail = booking.contactPerson.email;
    const ownerEmail = booking.user.email;

    logger.debug(`Lead email: ${leadEmail}`);
    logger.debug(`Owner email: ${ownerEmail}`);

    // Recuperar Owner ID
    try {
        logger.debug("Recovering Owner ID...");
        const ownerId = await Owners.getOwner(ownerEmail);
        logger.debug(`Owner ID: ${ownerId}`);

        // Intentar encontrar contacto
        logger.debug("Checking if contact exists...");
        const contactResponse = await Contacts.getContactByEmail(leadEmail);
        const contact = contactResponse ? new Contact(contactResponse) : null;

        if (contact) {
            const newDeal = mapBookingAndContactToDeal(booking, ownerId, contact);
            logger.debug(`New deal mapped: ${newDeal.data[0].Deal_Name}`);

            try {
                logger.debug("Creating deal...");
                const deal = await Deals.createDeal(newDeal);
                logger.debug("Verifying conversion...");
                await retryPattern(Deals.getDealById, [deal.data[0].details.id.toString()], 6, 10000);
            } catch (error) {
                logger.error("Failed to create deal from contact.", error);
            }

        } else {
            // Buscar lead por email
            logger.debug("Checking if lead exists...");
            let leadResponse = await Leads.getLeadByEmail(leadEmail);
            let lead = leadResponse ? new Lead(leadResponse) : null;

            if (!leadResponse || !Array.isArray(leadResponse) || leadResponse.length === 0) {
                logger.debug("Lead not found. Creating a new lead...");

                const newLead = mapBookingToLead(booking, ownerId);
                logger.debug(`New Lead mapped: ${newLead.data[0].First_Name}`);

                try {
                    logger.debug("Creating new lead...");
                    const createdLead = await Leads.createLead(newLead);

                    if (!createdLead) {
                        logger.error("Lead creation failed.");
                        return;
                    }

                    logger.debug("Verifying lead creation...");
                    leadResponse = await retryPattern(Leads.getLeadByEmail, [leadEmail], 6, 30000);
                    if (!leadResponse || !Array.isArray(leadResponse) || !leadResponse[0]) {
                        logger.error("Lead creation verification failed. No lead found after retries.");
                        return;
                    }

                    lead = new Lead(leadResponse);
                } catch (error) {
                    logger.error("Failed to create and verify lead.", error);
                    return;
                }
            }

            logger.debug(`Lead ID: ${lead[0].id}`);

            const newDeal = mapBookingAndLeadToDeal(booking, ownerId, lead);
            logger.debug(`New deal mapped: ${newDeal.data[0].Deals.Deal_Name}`);

            try {
                logger.debug("Converting lead to deal...");
                const deal = await Leads.convertLead(newDeal, lead[0].id);
                if (!deal) {
                    logger.error("Lead conversion to deal failed.");
                    return;
                }

                logger.debug("Verifying deal conversion...");
                await retryPattern(Deals.getDealById, [deal.data[0].Deals.toString()], 6, 10000);
            } catch (error) {
                logger.error("Failed to convert lead to deal.", error);
            }
        }
    } catch (err) {
        logger.error("Unexpected error in booking creation handler:", err);
    }
};
