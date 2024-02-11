const joi = require('joi');
const maestros = require('../service/docentes.service')

const schema = joi.object({
    nombre: joi.string().required(),
    correo: joi.string().required(),
    contraseña: joi.string(). required()
});
const crearUsuario =  async (req, res)=>{
    const  {nombre, correo, contraseña} = req.body
    console.log(req.body)
    try{
        const {error} = schema.validate(req.body)
        if(error){
           return res.status(400).json({ error: error.details[0].message })
        }
        const docentes = await maestros.crearUsuario(nombre, correo, contraseña)
        res.json(docentes)
    }catch(err){
        res.status(500).json({ error: err.message });
    }   
}
const iniciarSesion=async(req, res) =>{
    const { correo, contraseña } = req.body;
  
    if (!correo || typeof correo!== "string") {
        return res.status(400).json({ error: "Correo electrónico no válido" });
    }
  
    try {
        const resultado = await maestros.iniciarSesion(correo, contraseña);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  }

  const cerrarSesion = async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
  
    try {
      const resultado = await maestros.cerrarSesion(token);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports={
    crearUsuario,
    iniciarSesion,
    cerrarSesion
  }