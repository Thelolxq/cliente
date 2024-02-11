const jwt = require("jsonwebtoken");

const protegerRutas = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso no autorizado, token no proporcionado" });
  }

  try {
    const tokenSinBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenSinBearer, process.env.JWT_SECRET, {
      verifyOptions: {
        algorithms: ["HS256"],
        format: "compact",
      },
    });
    req.user = decoded;
    req.id_maestro = req.user.id_maestro;

    if (!req.id_maestro) {
      return res
        .status(400)
        .json({ mensaje: "El token no contiene el id_maestro" });
    }

    next();
  } catch (error) {
    res.status(403).json({ mensaje: "Token inválido" });
  }
};

module.exports = protegerRutas;