import express, { json } from "express";
import {webhooksRouter} from "./src/routes/webhooks.js";
import {corsMiddleware} from "./src/config/cors.js";

const app = express();

app.use(json());
app.use(corsMiddleware);
app.disable('x-powered-by');

app.use('/webhooks', webhooksRouter);

// Middleware de manejo de errores de payload
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        logger.warn('Malformed JSON payload.');
        res.status(400).json({ error: 'Invalid JSON format' });
    } else if (err.message === 'request aborted') {
        logger.warn('Request was aborted by the client.');
        res.status(400).json({ error: 'Request aborted unexpectedly' });
    } else {
        next(err); // delega a otros manejadores de errores si existen
    }
});

// Inicializar tokens en memoria
app.locals.authTokenTravelC = null;
app.locals.authTokenZoho = null;
app.locals.timeTokenTravelC = Date.now();
app.locals.timeTokenZoho = Date.now();

export default app;