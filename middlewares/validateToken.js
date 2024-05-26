const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config.js");

// Middleware de autenticación requerida
const authRequired = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("Token recibido:", token);

  if (!token) {
    console.log("No se proporcionó un token, autorización denegada");
    return res
      .status(401)
      .json({ message: "No se proporcionó un token, autorización denegada" });
  }

  const tokenParts = token.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    console.log("Token inválido o mal formateado");
    return res.status(401).json({ message: "Token inválido o mal formateado" });
  }

  const jwtToken = tokenParts[1];

  jwt.verify(jwtToken, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      console.log("Error al verificar el token:", error.message);
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    console.log("Token verificado correctamente. Decodificado:", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = authRequired;
