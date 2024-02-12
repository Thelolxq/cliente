const express = require("express");
const { conectados } = require("../controller/shortPolling.controller");
const router = express.Router();


//rutas para la app-------------------------------------------------------
router.get("/", conectados);

module.exports = router;
