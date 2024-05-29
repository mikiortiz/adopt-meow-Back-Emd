const Yup = require("yup");

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Debe ser un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  username: Yup.string().required("El nombre de usuario es requerido"),
  userType: Yup.string()
    .oneOf(["owner", "adopter"], "Tipo de usuario no válido")
    .required("El tipo de usuario es requerido"),
  image: Yup.string()
    .url("Debe ser una URL válida")
    .required("La URL de la imagen es requerida"),
});

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Debe ser un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
