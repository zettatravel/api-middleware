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

        console.log('El micrositio es zettatravel CONTROLLER.JS')
        res.status(200).json({message: 'Webhook recibido'});

        console.log('Controller Date.now() CONTROLLER.JS: ',Date.now())
        console.log('Controller app.locals.timeTokenTravelC CONTROLLER.JS: ',app.locals.timeTokenTravelC)

        if (Date.now() >= app.locals.timeTokenTravelC) {
            console.log('Date.now() es mayor o igual que el tiempo del token, debe autenticarse CONTROLLER.JS')
            auth.authTravelC(micrositeId).then(() => console.log('Autenticado CONTROLLER.JS'));
        }else{
            console.log('Date.now() es menor que tiempo del token, esta dentro de la hora (no se autentica) CONTROLLER.JS')
        }

        //realizar la busqueda de reserva
        //booking.getBookings(bookingReference, micrositeId).then(bookings => console.log('Reserva recibida: CONTROLLER.JS', bookings));


        //realizar proceso de zoho



    }
}

/*
// travelCAuth.js
let authToken = null;
let tokenExpiration = 0; // Se guarda en milisegundos

// Función que se encarga de autenticarse y obtener el token
const authenticate = async () => {
  const response = await fetch('https://api.travel-compositor.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: process.env.TRAVEL_USER,
      password: process.env.TRAVEL_PASS,
    }),
  });

  const data = await response.json();
  // Supongamos que data.expires_in viene en segundos
  authToken = data.token;
  tokenExpiration = Date.now() + data.expires_in * 1000;
};

// Función que retorna el token válido (reautentica si es necesario)
export const getToken = async () => {
  // Si no hay token o ha expirado, se vuelve a autenticar
  if (!authToken || Date.now() >= tokenExpiration) {
    await authenticate();
  }
  return authToken;
};

 */