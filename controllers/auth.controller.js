const userRegistration = require("../models/userRegister.model.js"); // Importa el modelo userRegistration en lugar de User
const {
  registerSchema,
  loginSchema,
} = require("../schemas/schemas.validator.js");
const bcrypt = require("bcryptjs");
const { TOKEN_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../libs/jwt.js");

const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Validar el esquema de validación Yup
    await registerSchema.validate(
      { email, password, username },
      { abortEarly: false }
    );

    const passwordHash = await bcrypt.hash(password, 10);
    const userFound = await userRegistration.findOne({ email }); // Utiliza userRegistration en lugar de User

    if (userFound) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const newUser = new userRegistration({
      username,
      email,
      password: passwordHash,
    }); // Utiliza userRegistration en lugar de User
    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    // Manejo de errores de validación Yup
    if (error.name === "ValidationError") {
      const yupErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: yupErrors });
    }
    // Otros errores del servidor
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

    const userFound = await userRegistration.findOne({ email }); // Utiliza userRegistration en lugar de User
    if (!userFound)
      return res.status(400).json({ message: "usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ message: "los datos ingresados no son válidos" });

    const token = await createAccessToken({ id: userFound._id });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("hola", "chau");
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    // Manejo de errores de validación Yup para inicio de sesión
    if (error.name === "ValidationError") {
      const yupErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: yupErrors });
    }

    // Otros errores del servidor
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const logout = (req, res) => {
  // Eliminar el token del localStorage
  // Esta parte del código está más relacionada con el cliente (frontend)
  // No es necesario manipular el token en el backend para realizar logout
  // El frontend debe encargarse de eliminar el token del almacenamiento local
  return res.sendStatus(200);
};

const profile = async (req, res) => {
  const userFound = await userRegistration.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({ message: "usuario no encontrado" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

const verifyToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "no autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.status(401).json({ message: "no autorizado" });

    const userFound = await userRegistration.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "no autorizado" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
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
