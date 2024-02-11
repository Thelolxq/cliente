const express = require('express');
const router = express.Router();
const maestros = require('../controller/maestros.controller');
const protegerRutas = require('../middlewares/protegerRutas');
const alumnos = require('../controller/alumnos.controller')

//rutas para la app-------------------------------------------------------
router
    .post('/', maestros.crearUsuario )
    .post('/iniciar', maestros.iniciarSesion)
    .delete('/:id_alumno', protegerRutas, alumnos.eliminarAlumno)
    .post('/cerrar', protegerRutas, maestros.cerrarSesion)


    module.exports= router