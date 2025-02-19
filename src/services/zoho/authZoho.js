import app from "../../../app.js";
import FormData from 'form-data';

export class authZoho {

    static auth = async () => {

        const formData = new FormData();
        formData.append('client_id', process.env.CLIENT_ID_ZOHO);
        formData.append('client_secret', process.env.CLIENT_SECRET_ZOHO);
        formData.append('refresh_token', process.env.REFRESH_TOKEN_ZOHO);
        formData.append('grant_type', 'refresh_token');

        try {
            const request = await fetch('https://accounts.zoho.com/oauth/v2/token',
                {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        ...formData.getHeaders()
                    },
                    body: formData
                })

            const data = await request.json();
            console.log('data.expires_in AUTH_ZOHO.JS: ', data.expires_in);

            app.locals.authTokenZoho = data.token;
            //console.log("app.locals.authTokenTravelC AUTH.JS: ", app.locals.authTokenTravelC);

            app.locals.timeTokenZoho = Date.now() + (data.expires_in * 1000 ) ;

            console.log("Date.now() AUTH_ZOHO.JS: ", Date.now());
            console.log("app.locals.timeTokenZoho AUTH_ZOHO.JS: ", app.locals.timeTokenZoho);

        } catch (err) {
            console.log(err);
        }
    }

}