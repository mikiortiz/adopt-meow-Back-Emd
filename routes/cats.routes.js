const express = require("express");
const router = express.Router();
const {
  createCat,
  getCats,
  updateCat,
  deleteCat,
  getUserCats,
} = require("../controllers/catsController");
const authRequired = require("../middlewares/validateToken");

// Ruta: crear un nuevo gato
router.post("/cats", authRequired, createCat);

// Ruta: obtener todos los gatos
router.get("/cats", authRequired, getCats);

// Ruta: Obtener los gatos del usuario autenticado
router.get("/user-cats", authRequired, getUserCats);

// Ruta: actualizar un gato por ID
router.put("/cats/:id", authRequired, updateCat);

// Ruta: eliminar un gato por ID
router.delete("/cats/:id", authRequired, deleteCat);

module.exports = router;
