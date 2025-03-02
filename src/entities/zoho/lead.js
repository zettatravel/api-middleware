import {toCapitalizedCase} from "../../utils/stringUtils.js";
import {formatDate} from "../../utils/dateUtils.js";

export class Lead {
    constructor(data = {}) {
        return (data.data || []).map(lead => ({
            owner: {
                name: lead.Owner?.name || null,
                id: lead.Owner?.id || null,
                email: lead.Owner?.email || null,
            },
            id: lead.id || null,
            company: lead.Company || null,
            email: lead.Email || null,
            destinoDeInteres: lead.Destino_de_inter_s || "Otros", // REQUIRED
            createdTime: formatDate(lead.Created_Time) || formatDate(new Date()),
            country: lead.Country || "UNKNOWN",
            campania: lead.Campa_a || "UNKNOWN",
            description: lead.Description || "UNKNOWN",
            rating: lead.Rating || null,
            firstName: toCapitalizedCase(lead.First_Name) || "UNKNOWN",
            leadStatus: lead.Lead_Status || "UNKNOWN",
            phone: lead.Phone || "",
            leadSource: lead.Lead_Source || "Otros",
        }));
    }
}

