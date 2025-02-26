import {formatDate} from "../../utils/dateUtils.js";
import {toCapitalizedCase} from "../../utils/stringUtils.js";

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

/*

console.log(booking.closedtourservice[0].name);



"Account_Name": {
                "name": "Zetta Travel Group Travelc",
                "id": "6382205000018251091"
            },


            Account_Name:{
                    name:
                    id:
                }
 */