const joi = require('joi')
const alumnos = require('../service/alumnos.service')

const schema = joi.object({
    nombre: joi.string().required(),
    correo: joi.string().required(),
    contraseña: joi.string(). required()
});

const crearAlumnos = async(req, res)=>{

    const {nombre, correo, contraseña}= req.body
    try{
        const {error} = schema.validate(req.body)
        if(error){
            return res.status(400).json({error: error.details[0].message})
        }
        const pupilos = await alumnos.crearAlumnos(nombre, correo, contraseña)
        res.json(pupilos)
    }catch(err){
        res.status(500).json({error: err.message})
    }

}

const obtenerAlumnos = async(req, res)=>{
    try{
        const pupilos = await alumnos.obtenerAlumnos()
        res.json(pupilos)
    }catch(err){
        console.error("error al obtener alumnos", err.message)
        res.status(500).json({err: err.message})
    }
}

const eliminarAlumno = async(req, res)=>{
    const {id_alumno}= req.params

    try{

        const resultado = await alumnos.eliminarAlumno(id_alumno)
        res.json(resultado)
    }catch(err){
        res.status(500).json({err: err.message})
    }
}

const iniciarSesion=async(req, res) =>{
    const { correo, contraseña } = req.body;
  
    if (!correo || typeof correo!== "string") {
        return res.status(400).json({ error: "Correo electrónico no válido" });
    }
  
    try {
        const resultado = await alumnos.iniciarSesion(correo, contraseña);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  }
  const cerrarSesion = async (req, res) => {
    const token = req.headers["authorization"];
  
    try {
      const resultado = await alumnos.cerrarSesion(token);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports= {
    crearAlumnos,
    obtenerAlumnos,
    eliminarAlumno,
    cerrarSesion,
    iniciarSesion
}