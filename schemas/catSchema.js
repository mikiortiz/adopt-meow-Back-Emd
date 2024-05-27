const Yup = require("yup");

const catSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  age: Yup.number().required("La edad es requerida"),
  color: Yup.string().required("El color es requerido"),
  sex: Yup.string().oneOf(['male', 'female'], 'El sexo debe ser "male" o "female"').required("El sexo es requerido"),
  castrated: Yup.string().oneOf(['yes', 'no'], 'Castrado debe ser "yes" o "no"').required("El estado de castración es requerido"),
  description: Yup.string().optional()
});

module.exports = catSchema;
