/// importar express para crear el servidor
const express = require("express");

const app = express(); // server

const log = require("./middlewares/log");
const validar = require("./middlewares/validar");

// importar data (base de datos ficticia)
let dispositivos = require("./datos/dispositivos");
const { disconnect } = require("node:cluster");
///const { parse } = require("node:path");

// puerto del servidor
const PORT = 3000;

// MIDDLEWARES

// leer json en el body
app.use(express.json()); //Este middleware permite que Express entienda JSON en el body

// Middleware de logs
app.use(log);

// ENDPOINTS

// GET dispositivos para obtener los datos
app.get("/dispositivos", (req, res) => {
  // obtener query params (estado)
  const { estado } = req.query;

  // filtro por estado si el usuario manda uno
  if (estado) {
    //Filtrar el array de dispositivos por estado
    const filtrados = dispositivos.filter((d) => d.estado === estado);
    // resultados filtrados
    return res.sendStatus(200).json(filtrados);
  }

  //si no hay filtro, llegan todos los dispositivos
  res.status(200).json(dispositivos);
});

//Get dispositivos por ID
app.get("/dispositivos/:id", (req, res) => {
  // botener el id de la url
  const id = parseInt(req.params.id);

  // buscar el dispositivo
  const dispositivo = dispositivos.find((d) => d.id === id);
  //validar si existe
  if (!dispositivo) {
    return res.status(404).json({ error: "dispositvo no encontrado" });
  }
  res.status(200).json(dispositivo);
});

// post crear dispositivo

app.post("/dispositivos", validar, (req, res) => {
  // datos enviados
  const { nombre, ip, estado, tipo } = req.body;

  const ipExiste = dispositivos.some((d) => d.ip === ip);
  
  if (ipExiste) {
    return res.status(400).json({ error: "La IP ya está registrada" });
  }

  // crear nuevo dispositivo
  const nuevo_dispositivo = {
    id: dispositivos.length + 1,
    nombre,
    ip,
    estado: estado || "activo", // valor por defecto
    tipo,
    createdAt: new Date(),
  };

  // guardar en la memoria
  dispositivos.push(nuevo_dispositivo);

  // creado correctamente
  res.status(201).json(nuevo_dispositivo);
});

/// put actualizar dispositivo
app.put("/dispositivos/:id", validar, (req, res) => {
  const id = parseInt(req.params.id);
   const { ip } = req.body;

  ///busacar posicion en el array
  const posicion = dispositivos.findIndex((d) => d.id === id);
  // validar que existe
  if (posicion === -1) {
    return res.status(404).json({ error: "no encontrado" });
  }

   // validar IP duplicada
  const ipExiste = dispositivos.some(
    (d) => d.ip === ip && d.id !== id
  );

  if (ipExiste) {
    return res.status(400).json({ error: "La IP ya está registrada" });
  }

  //actualizar
  dispositivos[posicion] = {
    ...dispositivos[posicion],
    ...req.body,
  };
  res.status(200).json(dispositivos[posicion]);
});

// eliminar dispositivos
app.delete("/dispositivos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const posicion = dispositivos.findIndex((d) => d.id === id);

  if (posicion === -1) {
    return res.status(404).json({ error: "no encontrado" });
  }
  // eliminamos del array
  dispositivos.splice(posicion, 1);

res.status(200).json({ mensaje: "dispositivo eliminado correctamente" });});

//inicio server
app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto ${PORT}`);
});
