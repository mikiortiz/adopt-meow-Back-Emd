const express = require("express");
const router = express.Router();
const {
  createCat,
  updateCat,
  deleteCat,
  getAllCats,
  adoptCat,
  updateCatOwner,
} = require("../controllers/catsController");
const authRequired = require("../middlewares/validateToken");

// Ruta: crear un nuevo gato
router.post("/cats", authRequired, createCat);

// Ruta: obtener todos los gatos
router.get("/cats", authRequired, getAllCats);

// Ruta: actualizar un gato por ID
router.put("/cats/:id", authRequired, updateCat);

// Ruta: eliminar un gato por ID
router.delete("/cats/:id", authRequired, deleteCat);

// Ruta: marcar un gato como adoptado
router.put("/cats/:id/adopted", authRequired, adoptCat);

//Ruta: actualización ownerID
router.put("/cats/:id/update-owner", authRequired, updateCatOwner);

//Ruta: remover el id del usuario en cesion del arrai de un gatito
router.delete("/cats/:id/remove-adopter", authMiddleware, removeAdopter);

module.exports = router;
