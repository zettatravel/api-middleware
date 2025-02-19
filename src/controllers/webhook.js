import {booking} from "../services/travelC/booking.js";
import {auth} from "../services/travelC/auth.js";
import app from "../../app.js";

export class webhookController {

    static async travelCBooking(req, res) {

        //recibir los datos del request
        const {micrositeId, bookingReference, type} = req.body;
        console.log('bookingReference CONTROLLER.JS: ',bookingReference);

        //verificar los datos del request
        if (micrositeId !== 'zettatravel') {
            console.log('El microsite es diferente a zettatravel, Retorna y no hace mas CONTROLLER.JS');
            return res.status(200).json({message: 'Webhook recibido'});
        }

        //console.log('El micrositio es zettatravel CONTROLLER.JS')
        res.status(200).json({message: 'Webhook recibido'});

        console.log('Controller Date.now() CONTROLLER.JS: ',Date.now())
        console.log('Controller app.locals.timeTokenTravelC CONTROLLER.JS: ',app.locals.timeTokenTravelC)

        if (Date.now() >= app.locals.timeTokenTravelC) {
            console.log('Date.now() es mayor o igual que el tiempo del token, debe autenticarse CONTROLLER.JS')
            await auth.authTravelC(micrositeId).then(() => console.log('Autenticado CONTROLLER.JS'));
        }else{
            console.log('Date.now() es menor que tiempo del token, esta dentro de la hora (no se autentica) CONTROLLER.JS')
        }

        //realizar la busqueda de reserva
        const bookings = await booking.getBookings(bookingReference, micrositeId);
        console.log('Realizo la busqueda CONTROLLER.JS: ',bookings )
        //realizar proceso de zoho

    }
}
