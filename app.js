import express, {json} from "express";
import {webhooksRouter} from "./src/routes/webhooks.js";
import {logger} from "./src/utils/logUtils.js";

const app = express()

app.use(json())


 // middelware de cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});


app.disable('x-powered-by')


const PORT = process.env.PORT ?? 3000

/*
Prueba de que
app.get('/', (req, res) => {res.json({message: "Hello World"})})
*/

app.use('/webhooks', webhooksRouter);

app.locals.authTokenTravelC = null;
app.locals.authTokenZoho = null;
app.locals.timeTokenTravelC = Date.now();
app.locals.timeTokenZoho = Date.now();


app.listen(PORT, () => {
    logger.debug(`Server running on http://localhost:${PORT}`);
    logger.debug(`Enviroment: ${process.env.NODE_ENV}`);
});


export default app