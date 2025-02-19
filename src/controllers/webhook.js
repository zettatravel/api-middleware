import {booking} from "../services/travelC/booking.js";
import {authTravelC} from "../services/travelC/authTravelC.js";
import {authZoho} from "../services/zoho/authZoho.js";
import app from "../../app.js";

export class webhookController {

    static async travelCBooking(req, res) {

        //recibir los datos del request
        const {micrositeId, bookingReference, type} = req.body;
        console.log('bookingReference CONTROLLER.JS: ', bookingReference);

        //verificar los datos del request
        if (micrositeId !== 'zettatravel') {
            console.log('El microsite es diferente a zettatravel, Retorna y no hace mas CONTROLLER.JS');
            return res.status(200).json({message: 'Webhook recibido'});
        }

        //console.log('El micrositio es zettatravel CONTROLLER.JS')
        res.status(200).json({message: 'Webhook recibido'});

        /*

        console.log('Controller Date.now() CONTROLLER.JS: ', Date.now())
        console.log('Controller app.locals.timeTokenTravelC CONTROLLER.JS: ', app.locals.timeTokenTravelC)

        if (Date.now() >= app.locals.timeTokenTravelC) {
            console.log('Date.now() de TC es mayor o igual que el tiempo del token, debe autenticarse CONTROLLER.JS')

            try {
                await authTravelC.auth(micrositeId);
                console.log('Autenticado en TravelC CONTROLLER.JS');
            } catch (error) {
                console.error("No Autenticando en TravelC CONTROLLER.JS", error);
            }

        } else {
            console.log('Date.now() de TC es menor que tiempo del token, esta dentro de la hora (no se autentica) CONTROLLER.JS')
        }

        //realizar la busqueda de reserva
        const bookings = await booking.getBookings(bookingReference, micrositeId);
        console.log('Realizo la busqueda CONTROLLER.JS: ', bookings.id)
*/
        //realizar proceso de zoho

        if (Date.now() >= app.locals.timeTokenZoho) {
            console.log('Date.now() de ZOHO es mayor o igual que el tiempo del token, debe autenticarse CONTROLLER.JS')

            try {
                await authZoho.auth();
                console.log('Autenticado en Zoho CONTROLLER.JS');
            } catch (error) {
                console.error("No Autenticando en Zoho CONTROLLER.JS", error);
            }

        } else {
            console.log('Date.now() de ZOHO es menor que tiempo del token, esta dentro de la hora (no se autentica) CONTROLLER.JS')
        }

        //una vez autenticado se realizan dos cosas,
        //1. se crea el contacto en zoho
        //2. se crea la reserva en zoho


    }
}
