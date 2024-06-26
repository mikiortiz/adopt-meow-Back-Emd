const Cat = require("../models/cat.model.js");
const catSchema = require("../schemas/catSchema.js");

const createCat = async (req, res) => {
  const userId = req.user.id;

  try {
    await catSchema.validate(req.body, { abortEarly: false });

    const newCat = new Cat({ ...req.body, ownerId: userId });
    const savedCat = await newCat.save();

    res.status(201).json(savedCat);
  } catch (error) {
    if (error.name === "ValidationError") {
      const yupErrors = error.inner
        ? error.inner.map((err) => ({
            path: err.path,
            message: err.message,
          }))
        : [];
      return res.status(400).json({ errors: yupErrors });
    }
    console.error("Error al crear el gato:", error);
    res.status(500).json({ message: "Error al crear el gato" });
  }
};

const getAllCats = async (req, res) => {
  try {
    const cats = await Cat.find().populate("ownerId", "username email");
    res.status(200).json(cats);
  } catch (error) {
    console.error("Error al obtener todos los gatos:", error);
    res.status(500).json({ message: "Error al obtener todos los gatos" });
  }
};

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

const addAdopter = async (req, res) => {
  const { id } = req.params; // ID del gato
  const { adopterId } = req.body; // ID del usuario que quiere adoptar al gato

  try {
    const cat = await Cat.findById(id);
    if (!cat) {
      return res.status(404).json({ message: "Gato no encontrado" });
    }

    if (!cat.adopterId.includes(adopterId)) {
      cat.adopterId.push(adopterId);
      await cat.save();
    }

    res.status(200).json(cat);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar adoptante", error });
  }
};

const adoptCat = async (req, res) => {
  const { id } = req.params;
  const { adopterId } = req.body; // Obtener adopterId del cuerpo de la solicitud

  try {
    const cat = await Cat.findById(id);

    if (!cat) {
      return res.status(404).json({ message: "Gato no encontrado" });
    }

    if (adopterId) {
      if (!cat.adopterId.includes(adopterId)) {
        cat.adopterId.push(adopterId);
      }
    } else {
      return res.status(400).json({ message: "Se requiere adopterId" });
    }

    const updatedCat = await cat.save();

    res.status(200).json(updatedCat);
  } catch (error) {
    console.error("Error al adoptar el gato:", error);
    res.status(500).json({ message: "Error al adoptar el gato", error });
  }
};

const updateCatOwner = async (req, res) => {
  const { id } = req.params; // ID del gato
  const { newOwnerId } = req.body; // ID del nuevo propietario

  try {
    const cat = await Cat.findById(id);
    if (!cat) {
      return res.status(404).json({ message: "Gato no encontrado" });
    }

    cat.ownerId = newOwnerId;
    cat.adopted = true;

    const updatedCat = await cat.save();

    res.status(200).json(updatedCat);
  } catch (error) {
    console.error("Error al actualizar el propietario del gato:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el propietario del gato", error });
  }
};

const removeAdopter = async (req, res) => {
  const { id } = req.params; // ID del gato
  const userId = req.user.id; // ID del usuario en sesión

  try {
    const cat = await Cat.findById(id);
    if (!cat) {
      return res.status(404).json({ message: "Gato no encontrado" });
    }

    const adopterIndex = cat.adopterId.indexOf(userId);
    if (adopterIndex > -1) {
      cat.adopterId.splice(adopterIndex, 1);
      await cat.save();
    } else {
      return res
        .status(400)
        .json({ message: "El usuario no es adoptante de este gato" });
    }

    res.status(200).json(cat);
  } catch (error) {
    console.error("Error al eliminar adoptante:", error);
    res.status(500).json({ message: "Error al eliminar adoptante", error });
  }
};

module.exports = {
  createCat,
  getAllCats,
  updateCat,
  deleteCat,
  addAdopter,
  adoptCat,
  updateCatOwner,
  removeAdopter, // Añadido nuevo método
};
