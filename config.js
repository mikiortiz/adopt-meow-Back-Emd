const TOKEN_SECRET = "Mi Clave Secreta";
module.exports = {
  TOKEN_SECRET,
};

//La siguiente opción es en caso de querer generar un token más seguro

// SE IMPORTA MODULO CRYPTO DE NODE.JS

//const crypto = require('crypto');

//const generateTokenSecret = () => {
//  return crypto.randomBytes(64).toString('hex');
//}

//console.log(generateTokenSecret()); // Imprime una clave secreta generada aleatoriamente
