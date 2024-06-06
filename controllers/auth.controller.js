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
    await registerSchema.validate(
      { email, password, username, userType, image },
      { abortEarly: false }
    );

    const userFound = await userRegistration.findOne({ email });

    if (userFound) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new userRegistration({
      username,
      email,
      password: passwordHash,
      userType,
      image,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });

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
    await loginSchema.validate({ email, password }, { abortEarly: false });

    const userFound = await userRegistration.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Los datos ingresados no son válidos" });

    const token = await createAccessToken({ id: userFound._id });

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
  return res.sendStatus(200);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userRegistration.find({});
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

const profile = async (req, res) => {
  try {
    const userFound = await userRegistration.findById(req.user.id);
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

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

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      userType: userFound.userType,
      image: userFound.image,
    });
  });
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRegistration.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      userType: user.userType,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

module.exports = {
  register,
  login,
  logout,
  profile,
  verifyToken,
  getAllUsers,
  getUserById,
};
