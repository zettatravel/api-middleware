import {formatDate} from "../../utils/dateUtils.js";
import {toCapitalizedCase} from "../../utils/stringUtils.js";

/**
 * Maps a booking object to a deal format compatible with the CRM system.
 *
 * @function mapBookingToDeal
 * @param {Object} booking - The booking object containing reservation details.
 * @param {string} id_user - The ID of the user (Owner) associated with the deal.
 * @param {Object} lead - The lead object containing additional customer information.
 * @returns {Object} - The mapped deal object formatted for the CRM.
 *
 * @example
 * const deal = mapBookingToDeal(bookingData, "123456", leadData);
 * console.log(deal);
 */

export const mapBookingToDeal = (booking, id_user, lead) => {
    return {
        data: [
            {
                overwrite: false,
                notify_lead_owner: false,
                notify_new_entity_owner: false,
                assign_to: id_user, // ID del Owner

                Deals: {
                    Deal_Name: `${booking.bookingReference.toUpperCase() ?? ""} / ${booking.contactPerson.name.toUpperCase() ?? ""} ${booking.contactPerson.lastName.toUpperCase() ?? ""} / X ${booking.destinationCount ?? ""} / ${booking.closedtourservice.length > 0 ? booking.closedtourservice[0].name.toUpperCase() : ""} / ${formatDate(booking.startDate) ?? ""}`,
                    Fecha_de_viaje: formatDate(booking.startDate ?? ""), // Fecha de viaje
                    Closing_Date: formatDate(new Date()?? ""), // Fecha de reserva (hoy)
                    Stage: "Qualification", // Estado de la reserva
                    Contacto_de_Emergencia: toCapitalizedCase(booking.emergencyContact.emergencyContactName) ?? "No Existe",
                    Tel_fono_Contacto_de_emergencia: booking.emergencyContact.emergencyContactPhone ?? "000000",
                    Amount: booking.pricebreakdown.totalPrice.microsite.amount ?? 0, // Monto total
                    Description: "Deal Generado automáticamente por Api-Middleware",
                    Currency: booking.pricebreakdown.totalPrice.microsite.currency ?? "",
                    Ingeniero_Preventa: id_user, // ID del Owner
                    Partner: id_user, // ID del Owner,
                    Tipo_De_Reserva: toCapitalizedCase(booking.tripType) ?? "",
                    Asistencia: booking.insuranceservice.length > 0 ? ["SI"] : ["NO"],
                    Total_Asistencia_Adicional : booking.insuranceservice.length > 0 ? booking.insuranceservice[0].pricebreakdown.totalPrice.microsite.amount : 0,
                    Destino_de_inter_s: lead.Destino_de_inter_s ?? "No Hay",
                    Fecha_creado_como_New_Lead: lead.Created_Time ?? formatDate(new Date()?? ""),
                    N_mero_de_Pax: booking.adultCount.toString() ?? "1",
                    Lead_Generado_en: "Otros" ?? ""
                }
            }
        ]
    };
};

