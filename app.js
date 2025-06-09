import express, { json } from "express";
import {webhooksRouter} from "./src/routes/webhooks.js";
import {corsMiddleware} from "./src/config/cors.js";

const app = express();

app.use(json());
app.use(corsMiddleware);
app.disable('x-powered-by');

app.use('/webhooks', webhooksRouter);

// Inicializar tokens en memoria
app.locals.authTokenTravelC = null;
app.locals.authTokenZoho = null;
app.locals.timeTokenTravelC = Date.now();
app.locals.timeTokenZoho = Date.now();

export default app;
