const express = require("express");
const router = express.Router();
const maestros = require("../controller/maestros.controller");
const protegerRutas = require("../middlewares/protegerRutas");
const alumnos = require("../controller/alumnos.controller");
const Notificador = require("../Notificador/Notificador.js")
const notifyObject = new Notificador(router);


function deleteWithNotify(notificador){
  return async function(req, res) {
    req.notificador = notificador;
    console.log("si jalo")

    await alumnos.eliminarAlumno(req,res,notificador);

  }
}

//rutas para la app-------------------------------------------------------
router
  .post("/", maestros.crearUsuario)
  .post("/iniciar", maestros.iniciarSesion)
  .delete("/:id_alumno", deleteWithNotify(notifyObject))
  .post("/cerrar", protegerRutas, maestros.cerrarSesion);

module.exports = router;
