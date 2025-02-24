const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function retryPattern(fetchFunction, params = [], attempts, timeOut) {

    for (let i = 0; i < attempts; i++) {

        console.log(`⏳ Esperando ${timeOut / 1000} segundos antes del próximo intento...`);
        await delay(timeOut);

        const verificacion = await fetchFunction(...params);

        if (verificacion) {
            console.log(`✅ Registro encontrado en intento ${i + 1}`);
            return verificacion;
        }


    }

    console.log('⚠️ No se encontró el registro después de varios intentos.');
    return null;

}