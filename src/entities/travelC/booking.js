import {toCapitalizedCase} from "../../utils/stringUtils.js";

export class Booking {
    constructor(data = {}) {
        this.id = data.id || null;
        this.bookingReference = data.bookingReference || null; //REQUIRED
        this.status = data.status || "UNKNOWN";
        this.tripType = data.tripType || "UNKNOWN"; //REQUIRED
        this.nightsCount = data.nightsCount || 0;
        this.destinationCount = data.destinationCount || 0; //REQUIRED
        this.creationDate = data.creationDate || null; //REQUIRED
        this.startDate = data.startDate || null; //REQUIRED
        this.endDate = data.endDate || null;
        this.adultCount = data.adultCount || 0; //REQUIRED
        this.childCount = data.childCount || 0; //REQUIRED
        this.infantCount = data.infantCount || 0; //REQUIRED
        this.contactPerson = {
            id: data.contactPerson?.id || null,
            name: toCapitalizedCase(data.contactPerson?.name) || "", //REQUIRED
            lastName: toCapitalizedCase(data.contactPerson?.lastName) || "", //REQUIRED
            requestedAge: data.contactPerson?.requestedAge || null,
            birthDate: data.contactPerson?.birthDate || null,
            documentNumber: data.contactPerson?.documentNumber || "",
            courtesyTitle: data.contactPerson?.courtesyTitle || "",
            documentType: data.contactPerson?.documentType || "",
            email: data.contactPerson?.email?.toLowerCase() || "", //REQUIRED
            phoneCountryCode: data.contactPerson?.phoneCountryCode || "", //REQUIRED
            phone: data.contactPerson?.phone || "", //REQUIRED
            country: toCapitalizedCase(data.contactPerson?.country) || "", //REQUIRED
            countryId: data.contactPerson?.countryId || "",
            passportExpirationDate: data.contactPerson?.passportExpirationDate || null,
        };
        this.user = {
            username: data.user?.username || "UNKNOWN",
            microsite: data.user?.microsite || "UNKNOWN",
            name: toCapitalizedCase(data.user?.name) || "UNKNOWN",
            surname: toCapitalizedCase(data.user?.surname) || "UNKNOWN",
            email: data.user?.email.toLowerCase() || "UNKNOWN",
            agency: {
                name: toCapitalizedCase(data.user?.agency?.name) || "UNKNOWN",
            },
        };
        this.emergencyContact = {
            emergencyContactName: toCapitalizedCase(data.emergencyContact?.emergencyContactName) || "UNKNOWN", //REQUIRED
            emergencyContactPhone: toCapitalizedCase(data.emergencyContact?.emergencyContactPhone) || "000000", //REQUIRED
        };
        this.pricebreakdown = {
            totalPrice : {
                microsite: {
                    amount: data.pricebreakdown?.totalPrice?.microsite?.amount || 0, //REQUIRED
                    currency: data.pricebreakdown?.totalPrice?.microsite?.currency || "UNKNOWN", //REQUIRED
                },
            }
        };
        this.insuranceservice = (data.insuranceservice || []).map(service => ({
            id: service.id || "UNKNOWN",
            bookingReference: service.bookingReference || "UNKNOWN",
            provider: service.provider || "UNKNOWN",
            pricebreakdown: {
                totalPrice: {
                    microsite: {
                        amount: service.pricebreakdown?.totalPrice?.microsite?.amount || 0,
                    }
                }
            }
        }));
        this.closedtourservice = (data.closedtourservice || []).map(service => ({
            id: service.id || "UNKNOWN",
            name: toCapitalizedCase(service.name) || "UNKNOWN",
        }))
    }
}

