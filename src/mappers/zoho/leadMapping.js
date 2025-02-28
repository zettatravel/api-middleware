import {toCapitalizedCase} from "../../utils/stringUtils.js";

/**
 * Maps a booking object and user ID to a lead format compatible with the CRM system.
 *
 * @function mapBookingToLead
 * @param {Object} booking - The booking object containing reservation and customer details.
 * @param {string} id_user - The ID of the user (Owner) associated with the lead.
 * @returns {Object} - The mapped lead object formatted for the CRM.
 *
 * @example
 * const lead = mapBookingToLead(bookingData, "123456");
 * console.log(lead);
 */

export const mapBookingToLead = (booking, id_user) => {
    return {
        data: [
            {
                Owner: {
                    id: id_user // Id del Owner o User
                },
                Phone: `${booking.contactPerson.phoneCountryCode ?? ""}${booking.contactPerson.phone ?? ""}`, // Celular
                Mobile: `${booking.contactPerson.phoneCountryCode ?? ""}${booking.contactPerson.phone ?? ""}`, // Celular
                Designation: toCapitalizedCase(`${booking.contactPerson.name ?? ""} TravelC`), // Nombre + TravelC
                Lead_Source: "Online Store", // Dato fijo
                Presupuesto: booking.pricebreakdown.totalPrice.microsite.amount.toString() ?? "", // Monto total
                Company: toCapitalizedCase(`${(booking.contactPerson.name ?? "")} TEST ${booking.contactPerson.lastName ?? ""}`) , // toCapitalizedCase(`${booking.user.agency.name ?? ""} TravelC`),
                First_Name: toCapitalizedCase(`${booking.contactPerson.name ?? ""} TEST`), // Nombre
                Last_Name: toCapitalizedCase(booking.contactPerson.lastName) ?? "", // Apellido
                Email: booking.contactPerson.email.toLowerCase() ?? "", // Correo
                Website: "https://zettatravel.com/", // Dato fijo
                Lead_Status: "New Leads", // Estado fijo
                Rating: "Active", // Calificación fija
                Currency: booking.pricebreakdown.totalPrice.microsite.currency ?? "", // Tipo de moneda
                Country: toCapitalizedCase(booking.contactPerson.country) ?? "", // País
                Description: "Nuevo Lead Desde TravelC (Reservas)" // Descripción fija
            }
        ]
    };
};


