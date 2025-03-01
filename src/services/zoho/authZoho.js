import fetch from "node-fetch";
import FormData from 'form-data';
import app from "../../../app.js";
import {logger} from "../../utils/logUtils.js";

export class AuthZoho {

    /**
     * Authenticates with Zoho API using the refresh token.
     * Retrieves and stores a new access token.
     */
    static auth = async () => {

        const formData = new FormData();
        formData.append('client_id', process.env.CLIENT_ID_ZOHO);
        formData.append('client_secret', process.env.CLIENT_SECRET_ZOHO);
        formData.append('refresh_token', process.env.REFRESH_TOKEN_ZOHO);
        formData.append('grant_type', 'refresh_token');

        try {
            logger.debug("Starting authentication with Zoho API...");
            const response = await fetch('https://accounts.zoho.com/oauth/v2/token',
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

            const data = await response.json();

            if (!response.ok) {
                logger.error(`Zoho authentication failed. Status: ${response.status} - ${response.statusText}`, { data });
                return;
            }

            app.locals.authTokenZoho = data.access_token;
            app.locals.timeTokenZoho = Date.now() + (data.expires_in * 1000 ) ;

            logger.info(`Zoho authentication successful.`);

        } catch (error) {
            logger.error("Error during Zoho authentication:", { error });
        }
    }

}