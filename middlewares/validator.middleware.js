const validatorSchema = (schema) => (req, res, next) => {
  try {
    schema.validateSync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors });
    } else {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

module.exports = validatorSchema;
