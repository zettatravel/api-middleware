import express, {json} from "express";
import {webhooksRouter} from "./src/routes/webhooks.js";
const app = express()

app.use(json())
app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

app.use('/webhooks', webhooksRouter);

app.locals.authTokenTravelC = null;
app.locals.authTokenZoho = null;
app.locals.timeTokenTravelC = Date.now();
app.locals.timeTokenTravelCTest = Date.now() + 3600;


app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
    console.log('app.locals.timeTokenTravelC del APP.JS: ', app.locals.timeTokenTravelC)
})

export default app