
import express, {json} from "express";
import {webhooksRouter} from "./src/routes/webhooks.js";
const app = express()

app.use(json())
app.disable('x-powered-by')
process.loadEnvFile()



const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) => {
    res.json({message:"Hello World"})
})

app.use('/webhooks', webhooksRouter);

app.locals.authTokenTravelC = null;
app.locals.authTokenZoho = null;
app.locals.timeTokenTravelC = Date.now();


app.listen(PORT, () => {
    //console.log(`server listening on port http://localhost:${PORT}`)
    console.log('app.locals.timeTokenTravelC del APP.JS: ', app.locals.timeTokenTravelC)
    //console.log('process.env.WEBHOOK_KEY APP.JS: ', `/travelc/bookings/${process.env.WEBHOOK_KEY}`)
})

export default app