# API de Reservas (api-bookings)

API desarrollada en Node.js con Express para gestionar webhooks de reservas de TravelC y sincronizarlas con Zoho CRM.

## Características

- Recepción y procesamiento de webhooks de TravelC
- Sincronización bidireccional con Zoho CRM
- Gestión de reservas (creación, modificación, cancelación)
- Autenticación automática con servicios externos
- Logging configurable con Winston
- CORS habilitado
- Manejo de reintentos para operaciones críticas

## Requisitos

- Node.js >= 14.x
- npm >= 6.x

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/api-bookings.git
   cd api-bookings
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias (ver sección Variables de Entorno).

## Uso

Inicia el servidor:
```sh
npm start
```

El servidor estará disponible en `http://localhost:3000` (o el puerto configurado en las variables de entorno).

## Endpoints

- `POST /webhooks/travelc/bookings/:webhookKey`  
  Recibe webhooks de TravelC para procesar reservas. Soporta operaciones de:
  - Creación de reservas (CREATED)
  - Modificación de reservas (MODIFIED)
  - Cancelación de reservas (CANCELED)

## Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

- `NODE_ENV`  
  Entorno de ejecución (`development` o `production`).

- `PORT`  
  Puerto en el que se ejecuta la aplicación (por defecto: 3000).

- `WEBHOOK_KEY`  
  Clave para validar los webhooks entrantes (se usa en la URL del endpoint).

- `TRAVELC_BASE_URL`  
  URL base para la API de TravelC.

- `USER_TRAVELC`  
  Usuario para autenticación con TravelC.

- `PASS_TRAVELC`  
  Contraseña para autenticación con TravelC.

- `TRAVELC_MICROSITE_ID`  
  ID del microsite en TravelC.

- `TRAVELC_EXTERNAL_ID`  
  ID externo de la agencia en TravelC.

- `ZOHO_BASE_URL`  
  URL base para la API de Zoho CRM.

- `CLIENT_ID_ZOHO`  
  ID de cliente para autenticación OAuth con Zoho.

- `CLIENT_SECRET_ZOHO`  
  Secreto de cliente para autenticación OAuth con Zoho.

- `REFRESH_TOKEN_ZOHO`  
  Token de actualización para autenticación OAuth con Zoho.

- `LOG_LEVEL`  
  Nivel de logs (`debug`, `info`, `warn`, `error`).

## Estructura del Proyecto

```
├── app.js                 # Punto de entrada de la aplicación
├── package.json           # Configuración del proyecto y dependencias
├── .env                   # Variables de entorno (no incluido en el repositorio)
├── .gitignore             # Archivos ignorados por git
├── src/
│   ├── controllers/       # Controladores de la aplicación
│   │   ├── webhook.js     # Controlador principal de webhooks
│   │   └── handlers/      # Manejadores específicos para cada tipo de operación
│   │       ├── createBooking.js
│   │       ├── modifyBooking.js
│   │       └── cancelBooking.js
│   ├── entities/          # Modelos de datos
│   │   ├── travelC/       # Modelos para TravelC
│   │   │   └── booking.js
│   │   └── zoho/          # Modelos para Zoho
│   │       ├── contact.js
│   │       ├── deal.js
│   │       └── lead.js
│   ├── mappers/           # Transformadores de datos entre sistemas
│   │   └── zoho/
│   │       ├── dealMapper.js
│   │       └── leadMapper.js
│   ├── routes/            # Definición de rutas
│   │   └── webhooks.js
│   ├── services/          # Servicios para interactuar con APIs externas
│   │   ├── travelC/       # Servicios para TravelC
│   │   │   ├── authTravelC.js
│   │   │   └── bookings.js
│   │   └── zoho/          # Servicios para Zoho
│   │       ├── authZoho.js
│   │       ├── contacts.js
│   │       ├── deals.js
│   │       ├── leads.js
│   │       └── owners.js
│   └── utils/             # Utilidades
│       ├── authUtils.js   # Utilidades de autenticación
│       ├── dateUtils.js   # Utilidades para manejo de fechas
│       ├── logUtils.js    # Configuración de logging
│       ├── retryUtils.js  # Utilidades para reintentos
│       └── stringUtils.js # Utilidades para manejo de strings
└── README.md
```

## Scripts disponibles

- `npm start` — Inicia el servidor en modo producción.
- `npm test` — Ejecuta las pruebas (actualmente no implementado).

## Notas importantes

- No subas el archivo `.env` al repositorio por seguridad.
- Los tokens de autenticación se almacenan en memoria y se renuevan automáticamente cuando expiran.
- La aplicación responde inmediatamente a los webhooks y procesa las operaciones de forma asíncrona.
- Se verifica que las reservas provengan del microsite y agencia correctos antes de procesarlas.
