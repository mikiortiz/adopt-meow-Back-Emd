const express = require("express");
const validatorSchema = require("../middlewares/validator.middleware.js");
const {
  registerSchema,
  loginSchema,
} = require("../schemas/schemas.validator.js");
const {
  register,
  login,
  logout,
  profile,
  verifyToken,
} = require("../controllers/auth.controller.js");
const authRequired = require("../middlewares/validateToken.js");

const router = express.Router();

// Definición de las rutas utilizando las funciones requeridas
router.post("/register", validatorSchema(registerSchema), register);
router.post("/login", validatorSchema(loginSchema), login);
router.post("/logout", logout);

router.get("/verify", verifyToken);
router.get("/profile", authRequired, profile);
module.exports = router;
