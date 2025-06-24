import express, {json, text} from "express";
import {webhooksRouter} from "./src/routes/webhooks.js";
import {corsMiddleware} from "./src/config/cors.js";
import {logger} from "./src/utils/logUtils.js";

const app = express();


// Middlewares generales
app.use(corsMiddleware);

// Usa express.text() para los webhooks, por si el Content-Type no es application/json
app.use('/webhooks', text({ type: '*/*' }));

// También puedes mantener json global si esperas JSON en otros endpoints
app.use(json());

app.disable('x-powered-by');

// Rutas
app.use('/webhooks', webhooksRouter);

// Inicializar tokens en memoria
app.locals.authTokenTravelC = null;
app.locals.authTokenZoho = null;
app.locals.timeTokenTravelC = Date.now();
app.locals.timeTokenZoho = Date.now();

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

export default app;





