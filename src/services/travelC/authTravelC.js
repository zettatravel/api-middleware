import app from "../../../app.js";
import fetch from "node-fetch";

export class authTravelC {

    //servicio para autenticarse con booking
    static auth = async (micrositeId) => {
        try {
            console.log("Entrando en authTravelC.auth() con micrositeId AUTH_TRAVELC.JS: ", micrositeId);
            console.log("process.env.TRAVELC_BASE_URL AUTH_TRAVELC.JS: ", process.env.TRAVELC_BASE_URL);

            const request = await fetch(`${process.env.TRAVELC_BASE_URL}/authentication/authenticate`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Accept-Encoding': 'gzip, deflate, br',
                    },
                    body: JSON.stringify({
                        username: process.env.USER_TRAVELC,
                        password: process.env.PASS_TRAVELC,
                        micrositeId: micrositeId
                    })
                });


            const data = await request.json();


            console.log('data.expirationInSeconds AUTH_TRAVELC.JS: ', data.expirationInSeconds);

            app.locals.authTokenTravelC = data.token;
            //console.log("app.locals.authTokenTravelC AUTH.JS: ", app.locals.authTokenTravelC);


            app.locals.timeTokenTravelC = Date.now() + (data.expirationInSeconds * 1000 ) ;

            console.log("Date.now() AUTH_TRAVELC.JS: ", Date.now());
            console.log("app.locals.timeTokenTravelC AUTH_TRAVELC.JS: ", app.locals.timeTokenTravelC);

        } catch (err) {
            console.log(err);
        }
    }


}

