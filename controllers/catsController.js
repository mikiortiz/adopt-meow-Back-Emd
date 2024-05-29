const Cat = require("../models/cat.model.js");
const catSchema = require("../schemas/catSchema.js");

const createCat = async (req, res) => {
  const userId = req.user.id;

  try {
    // Validar el cuerpo de la solicitud con el esquema de Yup
    await catSchema.validate(req.body, { abortEarly: false });

    const newCat = new Cat({ ...req.body, ownerId: userId });

    const savedCat = await newCat.save();

    res.status(201).json(savedCat);
  } catch (error) {
    if (error.name === "ValidationError") {
      const yupErrors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: yupErrors });
    }
    console.error("Error al crear el gato:", error);
    res.status(500).json({ message: "Error al crear el gato" });
  }
};

const getCats = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado

  try {
    // Buscar los gatos que pertenecen al usuario autenticado
    const cats = await Cat.find({ ownerId: userId }).populate(
      "ownerId",
      "username email"
    );
    res.status(200).json(cats);
  } catch (error) {
    console.error("Error al obtener los gatos:", error);
    res.status(500).json({ message: "Error al obtener los gatos" });
  }
};

// Actualizar un gato
const updateCat = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCat = await Cat.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCat) {
      return res.status(404).json({ message: "Gato no encontrado" });
    }
    res.status(200).json(updatedCat);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el gato", error });
  }
};

// Eliminar un gato
const deleteCat = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCat = await Cat.findByIdAndDelete(id);
    if (!deletedCat) {
      return res.status(404).json({ message: "Gato no encontrado" });
    }
    res.status(200).json({ message: "Gato eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el gato", error });
  }
};

module.exports = {
  createCat,
  getCats,
  updateCat,
  deleteCat,
  getUserCats,
};
