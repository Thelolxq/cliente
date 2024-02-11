const db = require('../database/dbconfig')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");






const crearUsuario = async (nombre, correo, contraseña) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT * FROM maestros WHERE correo = ?',
      [correo]
    );

    if (rows.length) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const encriptado = 10;
    const hash = await bcrypt.hash(contraseña, encriptado);

    await connection.query(
      'INSERT INTO maestros (nombre, correo, contraseña) VALUES (?, ?, ?)',
      [nombre, correo, hash]
    );

    await connection.commit();

    console.log("Usuario creado correctamente");
    return { mensaje: "Usuario creado correctamente" };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    throw new Error(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const iniciarSesion= async (correo, contraseña)=>{
     
    try{
        const [rows] = await db.query(
            'SELECT * FROM maestros WHERE correo = ?',
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
              id_maestro: usuario.id_maestro,
              esDocente: true,
              correo: usuario.correo,
            },
            process.env.JWT_SECRET
          );
          const [existingTokens] = await db.query('SELECT * FROM tokens WHERE id_maestro = ?', [usuario.id_maestro]);
          if (existingTokens.length > 0) {
           
            await db.query('UPDATE tokens SET token = ? WHERE id_maestro = ?', [token, usuario.id_maestro]);
          } else {
           
            await db.query('INSERT INTO tokens (id_maestro, token) VALUES (?, ?)', [usuario.id_maestro, token]);
          }
      
          return { mensaje: "Inicio de sesión exitoso", token };
        } catch (error) {
          throw new Error(error.message);
        }
}

const cerrarSesion = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_maestro = decoded.id_maestro; 
    await db.query('DELETE FROM tokens WHERE id_maestro = ?', [id_maestro]);

    return { mensaje: "Cierre de sesión exitoso" };
  } catch (error) {
    throw new Error(error.message);
  }
};

    module.exports={
      crearUsuario,
      iniciarSesion,
      cerrarSesion
    }


