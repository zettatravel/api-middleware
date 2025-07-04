import {toCapitalizedCase} from "../../utils/stringUtils.js";

/**
 * Maps a booking object and user ID to a lead format compatible with the CRM system.
 *
 * @function mapBookingToLead
 * @param {Object} booking - The booking object containing reservation and customer details.
 * @param {string} OwnerId - The ID of the user (Owner) associated with the lead.
 * @returns {Object} - The mapped lead object formatted for the CRM.
 *
 * @example
 * const lead = mapBookingToLead(bookingData, "123456");
 * console.log(lead);
 */

export const mapBookingToLead = (booking, OwnerId) => {
    return {
        data: [
            {
                Owner: {
                    id: OwnerId // Id del Owner o User
                },
                Phone: `${booking.contactPerson.phoneCountryCode} ${booking.contactPerson.phone}`, // Celular
                Mobile: `${booking.contactPerson.phoneCountryCode} ${booking.contactPerson.phone}`, // Celular
                Designation: `${booking.contactPerson.name ?? ""} - Travel Compositor`, // Nombre + TravelC
                Lead_Source: "Online Store", // Dato fijo
                Presupuesto: booking.pricebreakdown.totalPrice.microsite.amount.toString() ?? "", // Monto total
                Company: `${booking.contactPerson.name} ${booking.contactPerson.lastName}` , // toCapitalizedCase(`${booking.user.agency.name ?? ""} TravelC`),
                First_Name: `${booking.contactPerson.name}`, // Nombre
                Last_Name: booking.contactPerson.lastName, // Apellido
                Email: booking.contactPerson.email, // Correo
                Website: "https://zettatravel.com/", // Dato fijo
                Lead_Status: "New Leads", // Estado fijo
                Rating: "Active", // Calificación fija
                Currency: booking.pricebreakdown.totalPrice.microsite.currency ?? "", // Tipo de moneda
                Country: booking.contactPerson.country, // País
                Description: "Nuevo Lead Desde TravelC (Reservas)" // Descripción fija
            }
        ]
    };
};


