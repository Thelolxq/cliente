const db = require('../database/dbconfig')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const crearAlumnos = async(nombre, correo, contraseña)=>{

    let connection

    try{
        connection = await db.getConnection()
        await connection.beginTransaction()

        const [rows] = await connection.query(
            'SELECT * FROM alumnos WHERE correo = ?',
            [correo]
        );
        if(rows.length){
            throw new Error('este correo ya esta registrado')
        }

        const encriptado=10
        const hash = await bcrypt.hash(contraseña, encriptado)

        await connection.query(
            'INSERT INTO alumnos (nombre, correo, contraseña) VALUES (?,?,?)',
            [nombre, correo, hash]
        )
        await connection.commit()

        console.log("alumno creado correctamente")
        return {mensaje:"alumno creado correctamente"}
    }catch(err){
        if(connection){
            await connection.rollback()
        }
        throw new Error(err.message)
    }finally{
        if(connection){
            connection.release()
        }
    }

}

const obtenerAlumnos = async () => {
    let connection;

    try {
        connection = await db.getConnection();

        const [rows] = await connection.query('SELECT  id_alumno ,nombre, correo FROM alumnos');

        return rows;
    } catch (error) {
        
        throw new Error(error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

const eliminarAlumno = async(id_alumno)=>{
    let connection
    try{
        connection = await db.getConnection()
        await connection.beginTransaction()
        const [rows]= await db.query(
            'SELECT * FROM alumnos WHERE id_alumno = ?',
            [id_alumno]
        )
            if(rows.length===0){
                throw new Error("alumno no enontrado")
            }
            await connection.query(
                'DELETE FROM alumnos WHERE id_alumno = ?',
                [id_alumno]
            )
            await connection.commit()
            return {mensaje:"alumno eliminado correctamente"}
    }catch(err){
        if(connection){
            await connection.rollback()
        }
        throw new Error(err.message)
    }finally{
        if(connection){
            connection.release()
        }
    }

}



const iniciarSesion= async (correo, contraseña)=>{
     
    try{
        const [rows] = await db.query(
            'SELECT * FROM alumnos WHERE correo = ?',
            [correo]
        )
       
        if(!rows.length){
            throw new Error("el usuario no existe");
        }
        const usuario = rows[0];

        const contraseñaCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaCorrecta) {
            throw new Error("Credenciales incorrectas");
          }

          const token = jwt.sign(
            {
              id_alumno: usuario.id_alumno,
              esAlumno: true,
              correo: usuario.correo,
            },
            process.env.JWT_SECRET,
            
          );
    
          return { mensaje: "Inicio de sesión exitoso", token };
        } catch (error) {
          throw new Error(error.message);
        }
}

const cerrarSesion = async (token)=>{
    if (!token) {
        throw new Error("Acceso no autorizado");
      }
  
      try {
        const tokenSinBearer = token.replace('Bearer ', '');

        const decoded = jwt.verify(tokenSinBearer, process.env.JWT_SECRET);
  
        const nuevoToken = jwt.sign(
          {
            id_alumno: decoded.id_alumno,
            esAlumno: true,
            correo: decoded.correo,
          },
          process.env.JWT_SECRET,
          { expiresIn: 100000 }
        );
  
        return { mensaje: "Cierre de sesión exitoso", token: nuevoToken };
      } catch (error) {
        throw new Error(error.message);
      }
    }

module.exports= {
    crearAlumnos,
    obtenerAlumnos,
    eliminarAlumno,
    iniciarSesion,
    cerrarSesion
}