import {Booking} from "../services/travelC/booking.js";
import {AuthTravelC} from "../services/travelC/authTravelC.js";
import {AuthZoho} from "../services/zoho/authZoho.js";
import app from "../../app.js";
import {Deal} from "../services/zoho/deal.js";
import {Lead} from "../services/zoho/lead.js";
import {mapBookingToLead} from "../mappers/zoho/leadMapping.js";
import {Owner} from "../services/zoho/owner.js";
import {retryPattern} from "../utils/retryUtils.js";
import {mapBookingToDeal} from "../mappers/zoho/dealMapping.js";

export class webhookController {

    static async travelCBooking(req, res) {

        //recibir los datos del request
        const {micrositeId, bookingReference, type} = req.body;
        console.log('[CONTROLLER.JS] - Request recibido', bookingReference);

        //verificar que el microsite sea Zettatravel
        if (micrositeId !== 'zettatravel') {
            console.log('[CONTROLLER.JS] - El microsite es diferente a zettatravel, Retorna y no se hace mas ');
            return res.status(200).json({message: 'Webhook recibido'});
        }

        //console.log('El micrositio es zettatravel CONTROLLER.JS')
        res.status(200).json({message: 'Webhook recibido'});

        console.log('Controller Date.now() CONTROLLER.JS: ', Date.now())
        console.log('Controller app.locals.timeTokenTravelC CONTROLLER.JS: ', app.locals.timeTokenTravelC)

        if (Date.now() >= app.locals.timeTokenTravelC) {
            console.log('Date.now() de TC es mayor o igual que el tiempo del token, debe autenticarse CONTROLLER.JS')

            try {
                await AuthTravelC.auth(micrositeId);
                console.log('Autenticado en TravelC CONTROLLER.JS');
            } catch (error) {
                console.error("No Autenticando en TravelC CONTROLLER.JS", error);
            }

        } else {
            console.log('Date.now() de TC es menor que tiempo del token, esta dentro de la hora (no se autentica) CONTROLLER.JS')
        }

        //realizar la busqueda de reserva
        const booking = await Booking.getBookings(bookingReference, micrositeId);


        console.log('Realizo la busqueda CONTROLLER.JS: ', JSON.stringify(booking, null, 2));

        //almacenar el correo del lead de la reserva
        const email = booking.contactPerson.email.toString().toLowerCase()

        //almacenar el correo del Owner o de quien realiza la reserva
        const email_owner = booking.user.email.toString().toLowerCase()
        console.log('email_owner CONTROLLER.JS: ', email_owner)

        //realizar proceso de zoho
        if (Date.now() >= app.locals.timeTokenZoho) {
            console.log('Date.now() de ZOHO es mayor o igual que el tiempo del token, debe autenticarse CONTROLLER.JS')

            try {
                await AuthZoho.auth();
                console.log('Autenticado en Zoho CONTROLLER.JS');
            } catch (error) {
                console.error("No Autenticando en Zoho CONTROLLER.JS", error);
            }

        } else {
            console.log('Date.now() de ZOHO es menor que tiempo del token, esta dentro de la hora (no se autentica) CONTROLLER.JS')
        }

        const lead = await Lead.getLeadByEmail(email);


        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        //verificacion si el lead existe
        if (!lead) {
            console.log('No hay Conincidencias de lead se procede a crear Lead');

            const id_user = await Owner.getOwner(email_owner)

            console.log("id del Owner CONTROLLER.JS: ", id_user)
            // creacion del mapeo para insertar el newe lead
            const newLead = mapBookingToLead(booking, id_user);

            console.log(JSON.stringify(newLead, null, 2));

            //Creacion del Lead

            try {
                await Lead.createLead(newLead)
                console.log('Lead Creado CONTROLLER.JS');
            } catch (error) {
                console.error("Lead No Creado CONTROLLER.JS", error);
            }
        }

        // se realizan seis intentos cada 30 segundos para ver si se creo
        const verificacionLead = await retryPattern(Lead.getLeadByEmail, [email], 6, 30000);
        console.log('verificacionLead CONTROLLER.JS:', verificacionLead);

        // una vez creado el lead y verificado correctamente se procede a realizar la conversion a deal
        console.log('verificacionLead CONTROLLER.JS:', verificacionLead.data[0].id);


        const id_user = await Owner.getOwner(email_owner)
        const newDeal = mapBookingToDeal(booking, id_user,verificacionLead)
        console.log('verificacionLead.data[0].id: ',verificacionLead.data[0].id)
        console.log('verificacionLead.Destino_de_inter_s: ', verificacionLead.Destino_de_inter_s)
        console.log(JSON.stringify(newDeal, null, 2));

        try {
            const dealNew = await Lead.convertLead(newDeal, verificacionLead.data[0].id )

            console.log('Deal Creado CONTROLLER.JS', dealNew);

            //const verificacionDeal = await retryPattern(Deal.getDealByEmail, [dealNew.data[0].Accounts], 6, 30000);
            // se realizan seis intentos cada 30 segundos para ver si se creo
            //console.log('verificacionDeal CONTROLLER.JS:', verificacionDeal);

        } catch (error) {
            console.error("Deal No Creado CONTROLLER.JS", error);
        }

        // se realizan seis intentos cada 30 segundos para ver si se creo
        console.log('verificacionDeal CONTROLLER.JS:', verificacionDeal);

        console.log('Fin del Controller CONTROLLER.JS')

    }

}


//convertir lead en deal

// se verifica si la creacion del lead es exitosa
// Se envia mensaje de creacion exitosa


//.then((lead)=>{console.log(lead.data[0].Email)});


//una vez autenticado se realizan dos cosas,

//1. se verifica si el lead existe
// => Si Existe:
//      se convierte a deal
// => Si No Existe:
//      Se crea, se verifica que se creo
//      Se convierte en deal
// se verifica si la creacion del lead es exitosa
// Se envia mensaje de creacion exitosa

// console.log(lead.data[0].Email); // Acceder al email
// console.log(lead.data[0].Owner); // Esto imprimirá [Object]

// Si Owner es un objeto, accede a sus propiedades:
// console.log(lead.data[0].Owner.id);
// console.log(lead.data[0].Owner.name);