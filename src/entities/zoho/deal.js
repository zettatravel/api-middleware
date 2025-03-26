import {toCapitalizedCase} from "../../utils/stringUtils.js";
import {formatDate} from "../../utils/dateUtils.js";

export class Deal {
    constructor(data = {}) {
        return (data.data || []).map(deal => ({
            owner: {
                name: deal.Owner?.name || null,
                id: deal.Owner?.id || null,
                email: deal.Owner?.email || null,
            },
            id: deal.id || null,
            leadGeneradoEn: deal.Lead_Generado_en || "UNKNOWN",
            tipoTrato: Array.isArray(deal.TIpo_de_Trato) ? deal.TIpo_de_Trato : [deal.TIpo_de_Trato || "Venta nueva"],
            destinoInteres: deal.Destino_de_inter_s || "UNKNOWN",
            fechaCreadoNewLead: deal.Fecha_creado_como_New_Lead || formatDate(new Date()),
            stage: deal.Stage || "Qualification",
            tipoReserva: deal.Tipo_De_Reserva || "UNKNOWN"
        }));
    }
}

/*
* Owner: {
                    id: OwnerId,

                },
                Deal_Name: formatDealName(booking),
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
                Total_Asistencia_Adicional: calculateTotalAssistance(booking),
                Destino_de_inter_s: contact[0].destinoDeInteres,
                Fecha_creado_como_New_Lead: contact[0].createdTime,
                N_mero_de_Pax: (booking.adultCount + booking.childCount + booking.infantCount).toString() ?? "1",
                Lead_Generado_en: contact[0].leadSource,
                TIpo_de_Trato: ["Venta nueva"],
                C_digo_MTP: booking.bookingReference
* */