/**
 * Retries a function multiple times with a delay between each attempt.
 *
 * @async
 * @function retryPattern
 * @param {Function} fetchFunction - The function to be retried.
 * @param {Array} [params=[]] - Parameters to pass to `fetchFunction`.
 * @param {number} attempts - The number of retry attempts.
 * @param {number} timeOut - The delay (in milliseconds) between each retry attempt.
 * @returns {Promise<*>} - The result of `fetchFunction` if successful, otherwise `null` after exhausting all attempts.
 *
 * @example
 * async function getData(id) {
 *   return await fetch(`https://api.example.com/data/${id}`).then(res => res.json());
 * }
 *
 * const data = await retryPattern(getData, [123], 5, 3000);
 * console.log(data); // Logs fetched data or null if not found after retries.
 */

export async function retryPattern(fetchFunction, params = [], attempts, timeOut) {
    // Helper function to create a delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
