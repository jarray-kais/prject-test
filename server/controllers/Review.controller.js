import Review from "../models/review.model.js";
import Projet from "../models/Projet.model.js";
/*
Reviews (CRUD):

- Tout utilisateur peut voir les reviews d’un projet => getReviewsByProjet
- Un utilisateur connecté peut ajouter une review sur un projet => addReview
- Facultatif: Update/Delete sa propre review (user.id === review.author)
*/

const ReviewController = {
    // Voir toutes les reviews d'un projet (public)
    getReviewsByProjet: async (req, res, next) => {
        try {
            const { projetId } = req.params;
            // Vérifier si le projet existe
            const projet = await Projet.findById(projetId);
            if (!projet) {
                return res.status(404).json({
                    success: false,
                    message: "Projet not found"
                });
            }
            const reviews = await Review.find({ projet: projetId }).populate("author", "pseudo email");
            res.status(200).json({
                success: true,
                reviews
            });
        } catch (error) {
            next(error);
        }
    },

    // Ajouter une review (auth)
    addReview: async (req, res, next) => {
        try {
            const { projetId } = req.params;
            const { content } = req.body;
            const userId = req.user?.id;



            // Vérifie si l'utilisateur est connecté
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "You must be logged in to add a review"
                });
            }
            // Vérifier si le projet existe
            const projet = await Projet.findById(projetId);
            if (!projet) {
                return res.status(404).json({
                    success: false,
                    message: "Projet not found"
                });
            }
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Review content is required"
                });
            }
            const review = await Review.create({
                content,
                projet: projetId,
                author: userId
            });

            // Pour renvoyer l'object populé
            await review.populate("author", "pseudo email");
            res.status(201).json({
                success: true,
                message: "Review added successfully",
                review
            });
        } catch (error) {
            next(error);
        }
    },

    // Modifier sa propre review (auth)
    updateReview: async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const { content } = req.body;
            const userId = req.user?.id
            const review = await Review.findById(reviewId);
            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: "Review not found"
                });
            }
            if (review.author.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You can only edit your own review"
                });
            }
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Review content is required"
                });
            }

            review.content = content;
            await review.save();
            await review.populate("author", "pseudo email");
            res.status(200).json({
                success: true,
                message: "Review updated successfully",
                review
            });
        } catch (error) {
            next(error);
        }
    },

    // Supprimer sa propre review (auth)
    deleteReview: async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const userId = req.user?.id;

            const review = await Review.findById(reviewId);
            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: "Review not found"
                });
            }
            if (review.author.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You can only delete your own review"
                });
            }
            await Review.findByIdAndDelete(reviewId);
            res.status(200).json({
                success: true,
                message: "Review deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
};

export default ReviewController;
