import { Router } from "express";
import ProjetController from "../controllers/Projet.controller.js";
import { authMiddleware } from "../utils/util.js";

const projetRouter = Router();

// Créer un projet (auth)
projetRouter.post("/", authMiddleware, ProjetController.createProjet);

// Lire tous les projets (public)
projetRouter.get("/", ProjetController.getAllProjets);

// Récupérer les catégories (public)
projetRouter.get("/categories",authMiddleware, ProjetController.getCategories);

// Lire un projet + reviews (public)
projetRouter.get("/:id", ProjetController.getProjetById);

// Modifier un projet (auth)
projetRouter.put("/:id", authMiddleware, ProjetController.updateProjet);

// Supprimer un projet (auth)
projetRouter.delete("/:id", authMiddleware, ProjetController.deleteProjet);

export default projetRouter;
