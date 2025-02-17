import app from "../../../app.js";

export class auth {

    //servicio para autenticarse con booking
    static authTravelC = async (micrositeId) => {
        try {
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
                })

            const data = await request.json();


            console.log('data.expirationInSeconds AUTH.JS: ', data.expirationInSeconds);

            app.locals.authTokenTravelC = data.token;
            console.log("app.locals.authTokenTravelC AUTH.JS: ", app.locals.authTokenTravelC);


            app.locals.timeTokenTravelC = Date.now() + (data.expirationInSeconds * 1000 ) ;

            console.log("Date.now() AUTH.JS: ", Date.now());
            console.log("app.locals.timeTokenTravelC AUTH.JS: ", app.locals.timeTokenTravelC);

        } catch (err) {
            console.log(err);
        }
    }


}

/*
const postBookings = async (nombre, apellido) => {
  try {
    const resquest = await fetch("", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        apellido: apellido,
      }),
    });

    return await response.json();

  } catch (err) {
    console.log(`error al realizar la resquest ${err}`);
  }
};
*/
