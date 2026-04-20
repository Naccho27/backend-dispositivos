//// Middleware de logging
const log = (req, res, next) => {

    const metodo = req.method; // Método HTTP
    const ruta = req.url; // Ruta solicitada

    //fecha actual
    const fecha = new Date()

    //resultado en consola
    console.log(`[${metodo}] ${ruta} - ${fecha}`);

    next() // sin next no llega el resultado
};

module.exports = log;

