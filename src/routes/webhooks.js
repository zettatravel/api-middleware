import { Router } from 'express'
import {webhookController} from "../controllers/webhook.js";

export const webhooksRouter = Router()


// rutas para que vayan al controlador correspondiente
webhooksRouter.post(`/travelc/bookings/${process.env.WEBHOOK_KEY}`, webhookController.travelCBooking);

// webhooksRouter.post('/visito/...')