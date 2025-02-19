import app from "../../../app.js";

export class authTravelC {
    static auth = async (micrositeId) => {
        try {
            console.log("Entrando en authTravelC.auth() con micrositeId:", micrositeId);
            console.log("🔍 process.env.TRAVELC_BASE_URL:", process.env.TRAVELC_BASE_URL);

            const url = `${process.env.TRAVELC_BASE_URL}/authentication/authenticate`;
            const body = {
                username: process.env.USER_TRAVELC,
                password: process.env.PASS_TRAVELC,
                micrositeId: micrositeId
            };

            console.log("📤 Enviando petición a:", url);
            console.log("📦 Cuerpo de la petición:", JSON.stringify(body));

            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br',
                },
                body: JSON.stringify(body)
            });

            console.log("📥 Respuesta recibida de TravelC, Status:", request.status);

            const data = await request.json();
            console.log("✅ Datos de autenticación recibidos:", data);

            app.locals.authTokenTravelC = data.token;
            app.locals.timeTokenTravelC = Date.now() + (data.expirationInSeconds * 1000);

            console.log("⏳ Nuevo tiempo de expiración del token:", app.locals.timeTokenTravelC);
        } catch (err) {
            console.error("❌ Error en authTravelC.auth():", err);
        }
    };
}


