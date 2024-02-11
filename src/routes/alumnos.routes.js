const express = require('express')
const router = express.Router()
const alumnos = require('../controller/alumnos.controller')
const protegerRutas = require('../middlewares/protegerRutas');


//rutas para alumnos
router 
    .get('/', alumnos.obtenerAlumnos)   
    .post('/', alumnos.crearAlumnos)
    .post('/iniciar',alumnos.iniciarSesion)
    .post('/cerrar', alumnos.cerrarSesion)



    module.exports = router