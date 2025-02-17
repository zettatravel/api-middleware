export class booking {

    //servicio para obetner todos los registros
    static getBookings = async (bookingReference, micrositeId) => {
        try {
            const response = await fetch(`${process.env.TRAVELC_BASE_URL}/booking/getBookings/${micrositeId}/${bookingReference}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'auth-token': 'token',
                    'Accept-Encoding': 'gzip, deflate, br',
                }
            })

            return response.json();

        } catch (err) {
            console.log(`error al obtener la response ${err}`);
            return null;
        }
    }

// servicio para modificar los registro


//servicio para elminar los registros


}

/*// Funcion para haccer post a CRM Zoho
const postBookings = async (nombre, apellido) => {
  try {
    const resquest = await fetch("", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        apellido: apellido,
      }),
    });

    return await response.json();

  } catch (err) {
    console.log(`error al realizar la resquest ${err}`);
  }
};*/