// Utility functions
import {logger} from "../../utils/logUtils.js";

// Zoho services
import {Deals} from "../../services/zoho/deals.js";
import {Owners} from "../../services/zoho/owners.js";

// Data mapping
import {mapBookingAndDealToNewDeal} from "../../mappers/zoho/dealMapping.js";

// Entities
import {Deal} from "../../entities/zoho/deal.js";


export const handleCancel = async (booking) => {

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

    //si se tiene el deal antiguo, se hace mapeo de booking y old deal a deal
    if (deal){
        // variable para cambiar estado del deal
         const stage = "Closed Lost"

        //mapeo del nuevo deal
        const dealModified = mapBookingAndDealToNewDeal(booking, OwnerId, deal, stage)
        logger.debug(`New deal mapped: ${dealModified.data[0].Deal_Name}`);

        // Modificar deal por id
        await Deals.modifyDealById(dealModified, deal[0].id);
        logger.debug(`Deal Canceled: ${dealModified.data[0].Deal_Name}`);

    }
}
