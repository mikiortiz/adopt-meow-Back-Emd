const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config.js");

function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}

module.exports = {
  createAccessToken,
};
