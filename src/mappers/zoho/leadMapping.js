// Constante donde se mapea la informacion de bookings y User para crear un Lead
import {toCapitalizedCase} from "../../utils/stringUtils.js";

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
