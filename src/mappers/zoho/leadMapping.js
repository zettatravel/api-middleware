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
                Company: toCapitalizedCase(booking.user.agency.name) ?? "", // Nombre Compañía
                First_Name: toCapitalizedCase(booking.contactPerson.name) ?? "", // Nombre
                Last_Name: toCapitalizedCase(booking.contactPerson.lastName) ?? "", // Apellido
                Email: booking.contactPerson.email.toLowerCase() ?? "", // Correo
                Website: "https://zettatravel.com/", // Dato fijo
                Lead_Status: "Facebook", // Estado fijo
                Rating: "Active", // Calificación fija
                Secondary_Email: "", // Correo secundario vacío
                Currency: booking.pricebreakdown.totalPrice.microsite.currency ?? "", // Tipo de moneda
                Street: "", // Dirección vacía
                State: "", // Estado vacío
                Country: toCapitalizedCase(booking.contactPerson.country) ?? "", // País
                City: "", // Ciudad vacía
                Zip_Code: "", // Código ZIP vacío
                Description: "Nuevo Lead Desde TravelC (Reservas)" // Descripción fija
            }
        ]
    };
};
