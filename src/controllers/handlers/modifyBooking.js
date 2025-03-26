import {logger} from "../../utils/logUtils.js";
import {Deals} from "../../services/zoho/deals.js";
import {Deal} from "../../entities/zoho/deal.js";
import {Contacts} from "../../services/zoho/contact.js";
import {Contact} from "../../entities/zoho/contact.js";
import {mapBookingAndContactToDeal} from "../../mappers/zoho/dealMapping.js";
import {Owners} from "../../services/zoho/owners.js";

export const handleModify = async (booking) => {

    //almacenar el correo del contact o lead de la reserva
    const leadEmail = booking.contactPerson.email;
    logger.debug(`Lead email: ${leadEmail}`);

    //almacenar el correo del Owner o de quien realiza la reserva
    const OwnerEmail = booking.user.email;
    logger.debug(`Owner email: ${OwnerEmail}`);

    // Creacion de la variable Owner Id para recuperar el id del Owner
    logger.debug("recovering Owner ID...");
    const OwnerId = await Owners.getOwner(OwnerEmail)
    logger.debug(`Owner ID: ${OwnerId}`);

    //Realizar la busqueda del deal por booking reference
    logger.debug("Checking if deal exists...");
    let dealResponse = await Deals.getDealByBookingReference(booking.bookingReference);
    let deal = dealResponse ? new Deal(dealResponse) : null;

    // Realizar busqueda del contact de ese deal
    logger.debug("Checking if contact exists...");
    let contactResponse = await Contacts.getContactByEmail(leadEmail);
    let contact = contactResponse ? new Contact(contactResponse) : null;

    //si se tiene el contact se hace mapeo de booking y contact a deal
    const dealModified = mapBookingAndContactToDeal(booking, OwnerId, contact)
    logger.debug(`New deal mapped: ${dealModified.data[0].Deal_Name}`);

    // Modificar deal por id
    await Deals.modifyDealById(dealModified, deal[0].id);

}