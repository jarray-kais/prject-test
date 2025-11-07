import Projet from "../models/Projet.model.js";
import Review from "../models/review.model.js";

const ProjetController = {
    // Créer un projet
    createProjet: async (req, res, next) => {
        try {
            const { title, category, description } = req.body;
            if (!title || !category || !description) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }


            const projet = await Projet.create({
                title,
                category,
                description,
                author: req.user.id,
            });
            res.status(201).json({
                success: true,
                message: "Projet created successfully",
                projet
            });
        } catch (error) {
            next(error);
        }
    },

    // Lire la liste de tous les projets
    getAllProjets: async (req, res, next) => {
        try {
            // Récupérer les paramètres de pagination depuis la query string
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 6, 6); // Maximum 5 par page
            const skip = (page - 1) * limit;

            // Compter le nombre total de projets
            const totalProjets = await Projet.countDocuments();
            
            // Récupérer les projets avec pagination
            const projets = await Projet.find()
                .populate("author", "pseudo email")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }); //trier par date de création

            const totalPages = Math.ceil(totalProjets / limit);

            res.status(200).json({
                success: true,
                projets,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProjets,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Afficher les détails d’un projet
    getProjetById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const projet = await Projet.findById(id).populate("author", "pseudo email");
            if (!projet) {
                return res.status(404).json({
                    success: false,
                    message: "Projet not found",
                });
            }
            // Lister les reviews associées
            const reviews = await Review.find({ projet: id }).populate("author", "pseudo email");
            res.status(200).json({
                success: true,
                projet,
                reviews
            });
        } catch (error) {
            next(error);
        }
    },

    // Modifier un de ses propres projets
    updateProjet: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, category, description } = req.body;
            
            // Trouver le projet et vérifier si l'utilisateur courant est l'auteur
            const projet = await Projet.findById(id);
            if (!projet) {
                return res.status(404).json({
                    success: false,
                    message: "Projet not found",
                });
            }
            
            // Vérifier que l'utilisateur est l'auteur du projet
            if (projet.author.toString() !== req.user.id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized: you can only update your own projects",
                });
            }
            // Mettre à jour le projet
            projet.title = title ?  title :  projet.title ;
            projet.category = category ? category : projet.category;
            projet.description = description ? description : projet.description;
            await projet.save();
            
            // Populate l'auteur pour la réponse
            await projet.populate("author", "pseudo email");
            
            res.status(200).json({
                success: true,
                message: "Projet updated successfully",
                projet
            });
        } catch (error) {
            next(error);
        }
    },

    // Supprimer un de ses propres projets (+ supprimer les reviews associées)
    deleteProjet: async (req, res, next) => {
        try {
            const { id } = req.params;
            const adminrole = req.user.role;
            // Trouver le projet et vérifier si l'utilisateur courant est l'auteur
            const projet = await Projet.findById(id);
            if (!projet) {
                return res.status(404).json({
                    success: false,
                    message: "Projet not found",
                });
            }
            
            if (adminrole !== "admin" && projet.author.toString() !== req.user.id.toString()) {
                return res.status(403).json({
                  success: false,
                  message: "Unauthorized: you can only delete your own projects",
                });
              }
            // Supprimer les reviews associées
            await Review.deleteMany({ projet: id });
            await Projet.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Projet and associated reviews deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    // Récupérer la liste des catégories disponibles (données dynamiques)
    getCategories: async (req, res, next) => {
        try {
            const categories = await Projet.distinct("category");
            res.status(200).json({
                success: true,
                categories,
            });
        } catch (error) {
            next(error);
        }
    }
};

export default ProjetController;
