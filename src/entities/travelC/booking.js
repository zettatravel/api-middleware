export class Bookings {
    constructor(data) {
        this.id = data?.id || null;
        this.reference = data?.reference || null; // Código de reserva
        this.contactPerson = data?.contactPerson || {}; // Cliente principal
        this.user = data?.user || {}; // Usuario que hizo la reserva
        this.status = data?.status || "unknown"; // Estado de la reserva
        this.totalPrice = data?.totalPrice || 0; // Precio total
    }

    getContactEmail() {
        return this.contactPerson?.email || "No email";
    }

    getOwnerEmail() {
        return this.user?.email || "No email";
    }
}
