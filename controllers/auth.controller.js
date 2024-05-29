const userRegistration = require("../models/userRegister.model.js");
const {
  registerSchema,
  loginSchema,
} = require("../schemas/schemas.validator.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../libs/jwt.js");

const register = async (req, res) => {
  const { email, password, username, userType, image } = req.body;

  try {
    // Validar el esquema de validación Yup
    await registerSchema.validate(
      { email, password, username, userType, image },
      { abortEarly: false }
    );

    // Verificar si el usuario ya existe
    const userFound = await userRegistration.findOne({ email });

    if (userFound) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new userRegistration({
      username,
      email,
      password: passwordHash,
      userType,
      image,
    });

    // Guardar el usuario en la base de datos
    const userSaved = await newUser.save();

    // Crear token de acceso
    const token = await createAccessToken({ id: userSaved._id });

    // Devolver respuesta con el token y los datos del usuario registrado
    res.setHeader("Authorization", `Bearer ${token}`);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      userType: userSaved.userType,
      image: userSaved.image,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const yupErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: yupErrors });
    }
    console.error("Error al registrar:", error);
    res.status(500).json({
      error: "registration_failed",
      message: "Error al registrar el usuario",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar el esquema de validación Yup para inicio de sesión
    await loginSchema.validate({ email, password }, { abortEarly: false });

    // Buscar al usuario por su email
    const userFound = await userRegistration.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Los datos ingresados no son válidos" });

    // Crear token de acceso
    const token = await createAccessToken({ id: userFound._id });

    // Devolver respuesta con el token y los datos del usuario autenticado
    res.setHeader("Authorization", `Bearer ${token}`);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      userType: userFound.userType,
      image: userFound.image,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const yupErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: yupErrors });
    }

    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const logout = (req, res) => {
  // No es necesario manipular el token en el backend para realizar logout
  // El frontend debe encargarse de eliminar el token del almacenamiento local
  return res.sendStatus(200);
};

const profile = async (req, res) => {
  try {
    // Buscar al usuario por su ID
    const userFound = await userRegistration.findById(req.user.id);
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // Devolver los datos del usuario
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      userType: userFound.userType,
      image: userFound.image,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};

const verifyToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.status(401).json({ message: "No autorizado" });

    const userFound = await userRegistration.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "No autorizado" });

    // Devolver los datos del usuario autenticado
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      userType: userFound.userType,
      image: userFound.image,
    });
  });
};

module.exports = {
  register,
  login,
  logout,
  profile,
  verifyToken,
};
