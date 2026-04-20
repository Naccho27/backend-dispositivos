// validar ip
const ipValida = (ip) => {
  //metodo para validar ip

 // verificamos que sea string
  if (typeof ip !== "string") return false;

  const partes = ip.split("."); // separar la IP por partes

  if (partes.length !== 4) return false; // la ip debe tener 4 partes

  return partes.every((p) => {
    // verificar cada parte sea
    // un numero entre el rango 0 y 255

    if (p === "" || isNaN(p)) return false; // si está vacío o no es número respuesta negativa

    const num = Number(p);
    return num >= 0 && num <= 255;
  });
};

/// MIDDLEWARES de validacion

const dispositivos = require("../datos/dispositivos");

const validacion = (req, res, next) => {
  const { nombre, ip, tipo } = req.body;

  // validar nombre
  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: "Nombre obligatorio" });
  }

  // validar ip formato
  if (!ip || !ipValida(ip)) {
    return res.status(400).json({ error: "IP inválida" });
  }

  // validar ip duplicada
  const ipExiste = dispositivos.some((d) => d.ip === ip);

  if (ipExiste) {
    return res.status(400).json({ error: "La IP ya está registrada" });
  }

  // validar tipo
  if (!tipo) {
    return res.status(400).json({ error: "Tipo obligatorio" });
  }

  next();
};

module.exports = validacion;
