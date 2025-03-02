import {formatDate} from "../../utils/dateUtils.js";
import {toCapitalizedCase} from "../../utils/stringUtils.js";

/**
 * Maps a booking object to a deal format compatible with the CRM system.
 *
 * @function mapBookingToDeal
 * @param {Object} booking - The booking object containing reservation details.
 * @param {string} OwnerId - The ID of the user (Owner) associated with the deal.
 * @param {Object} lead - The lead object containing additional customer information.
 * @returns {Object} - The mapped deal object formatted for the CRM.
 *
 * @example
 * const deal = mapBookingToDeal(bookingData, "123456", leadData);
 * console.log(deal);
 */

export const mapBookingToDeal = (booking, OwnerId, lead) => {
    return {
        data: [
            {
                overwrite: false,
                notify_lead_owner: false,
                notify_new_entity_owner: false,
                assign_to: OwnerId, // ID del Owner

                Deals: {
                    Deal_Name: `${booking.bookingReference.toUpperCase() ?? ""} / ${booking.contactPerson.name.toUpperCase() ?? ""} ${booking.contactPerson.lastName.toUpperCase() ?? ""} / X ${booking.destinationCount ?? ""} / ${booking.closedtourservice.length > 0 ? booking.closedtourservice.map(service => service.name.toUpperCase()).join(" - ") : ""} / ${formatDate(booking.startDate) ?? ""}`,
                    Fecha_de_viaje: formatDate(booking.startDate ?? new Date()), // Fecha de viaje
                    Closing_Date: formatDate(booking.creationDate ?? new Date()), // Fecha de reserva (hoy)
                    Stage: "Qualification", // Estado de la reserva
                    Contacto_de_Emergencia: booking.emergencyContact.emergencyContactName,
                    Tel_fono_Contacto_de_emergencia: booking.emergencyContact.emergencyContactPhone,
                    Amount: booking.pricebreakdown.totalPrice.microsite.amount, // Monto total
                    Description: "Deal Generado de forma automatica",
                    Currency: booking.pricebreakdown.totalPrice.microsite.currency,
                    Ingeniero_Preventa: OwnerId, // ID del Owner
                    Partner: OwnerId, // ID del Owner,
                    Tipo_De_Reserva: "Otros",
                    Asistencia: booking.insuranceservice.length > 0 ? ["SI"] : ["NO"],
                    Total_Asistencia_Adicional: booking.insuranceservice.length > 0 ? booking.insuranceservice.reduce((total, service) => total + (service.pricebreakdown?.totalPrice?.microsite?.amount || 0), 0) : 0,
                    Destino_de_inter_s: lead[0].destinoDeInteres,
                    Fecha_creado_como_New_Lead: lead[0].createdTime,
                    N_mero_de_Pax: (booking.adultCount + booking.childCount + booking.infantCount).toString() ?? "1",
                    Lead_Generado_en: lead[0].leadSource
                }
            }
        ]
    };
};

