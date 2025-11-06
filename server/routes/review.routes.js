import { Router } from "express";
import ReviewController from "../controllers/Review.controller.js";
import { authMiddleware } from "../utils/util.js";

const reviewRouter = Router();

// Voir toutes les reviews d'un projet (public)
reviewRouter.get("/projet/:projetId", ReviewController.getReviewsByProjet);

// Ajouter une review à un projet (auth)
reviewRouter.post("/projet/:projetId", authMiddleware, ReviewController.addReview);

// Modifier sa propre review (auth)
reviewRouter.put("/:reviewId", authMiddleware, ReviewController.updateReview);

// Supprimer sa propre review (auth)
reviewRouter.delete("/:reviewId", authMiddleware, ReviewController.deleteReview);

export default reviewRouter;
