import {formatDate} from "../../utils/dateUtils.js";

export const mapBookingToDeal = (booking, id_user) => {
    return {
        data: [
            {
                overwrite: false, // Nombre Lead + TravelC
                notify_lead_owner: false,
                notify_new_entity_owner: false,
                assign_to: id_user, // ID del Owner

                Deals: {
                    Deal_Name: `${booking.bookingReference.toUpperCase()} / ${booking.contactPerson.name.toUpperCase()} ${booking.contactPerson.lastName.toUpperCase()} / X ${booking.destinationCount} / ${formatDate(booking.startDate)}`, //${booking.closedtourservice.name.toUpperCase()}
                    Fecha_de_viaje: formatDate(booking.startDate), // Fecha de viaje
                    Closing_Date: formatDate(new Date()), // Fecha de reserva (hoy)
                    Stage: "Qualification", // Estado de la reserva
                    Contacto_de_Emergencia: "Contacto_de_Emergencia" ,//booking.emergencyContact.emergencyContactName || "",
                    Tel_fono_Contacto_de_emergencia: "3204478514",//booking.emergencyContact.emergencyContactPhone || "",
                    Amount: booking.pricebreakdown.totalPrice.microsite.amount || 0, // Monto total
                    Description: "Deal Generado automáticamente por API-MIDDLEWARE",
                    Currency: booking.pricebreakdown.totalPrice.microsite.currency || "",
                    Ingeniero_Preventa: id_user, // ID del Owner
                    Partner: id_user, // ID del Owner,
                    Tipo_De_Reserva: "Closedtour",
                    Asistencia: ["SI"],
                    Total_Asistencia_Adicional: 150,
                    Destino_de_inter_s: "Turquía y Egipto",
                    Fecha_creado_como_New_Lead: "2025-02-24",
                    N_mero_de_Pax: "668456651",
                    Lead_Generado_en: "Otros"

                }
            }
        ]
    };
};