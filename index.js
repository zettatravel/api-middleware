
import express, {json} from "express";
import {webhooksRouter} from "./src/routes/webhooks.js";
const index = express()

index.use(json())
index.disable('x-powered-by')
//process.loadEnvFile()



const PORT = process.env.PORT ?? 3000

index.get('/', (req, res) => {
    res.json({message:"Hello World"})
})

index.use('/webhooks', webhooksRouter);

index.locals.authTokenTravelC = null;
index.locals.authTokenZoho = null;
index.locals.timeTokenTravelC = Date.now();
index.locals.timeTokenZoho = Date.now();


index.listen(PORT, () => {
    //console.log(`server listening on port http://localhost:${PORT}`)
    console.log('app.locals.timeTokenTravelC del APP.JS: ', index.locals.timeTokenTravelC)
    //console.log('process.env.WEBHOOK_KEY APP.JS: ', `/travelc/bookings/${process.env.WEBHOOK_KEY}`)
})

export default index