import {toCapitalizedCase} from "../../utils/stringUtils.js";
import {formatDate} from "../../utils/dateUtils.js";

export class Contact {
    constructor(data = {}) {
        return (data.data || []).map(contact => ({
            owner: {
                name: contact.Owner?.name || null,
                id: contact.Owner?.id || null,
                email: contact.Owner?.email || null,
            },
            id: contact.id || null,
            email: contact.Email || null,
            destinoDeInteres: contact.Destino_de_inter_s || "Otros",
            createdTime: formatDate(contact.Created_Time) || formatDate(new Date()),
            description: contact.Description || "UNKNOWN",
            firstName: toCapitalizedCase(contact.First_Name) || "UNKNOWN",
            lastName: toCapitalizedCase(contact.Last_Name) || "UNKNOWN",
            fullName: toCapitalizedCase(contact.Full_Name) || "UNKNOWN",
            phone: contact.Phone || "",
            leadSource: contact.Lead_Source || "Otros",
        }));
    }
}

