import Category from "../models/Category.model.js";
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
      let projetData = {
        title,
        description,
        category,
        author: req.user.id,
      };
      const existCategory = await Category.findOne({ name: category.trim() });
      if (existCategory) {
        projetData.category_id = existCategory._id;
      }
      const projet = await Projet.create(projetData);
      res.status(201).json({
        success: true,
        message: "Projet created successfully",
        projet,
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
        .populate("category_id", "name")
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
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Afficher les détails d’un projet
  getProjetById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const projet = await Projet.findById(id)
        .populate("author", "pseudo email")
        .populate("category_id", "name");
      if (!projet) {
        return res.status(404).json({
          success: false,
          message: "Projet not found",
        });
      }
      // Lister les reviews associées
      const reviews = await Review.find({ projet: id }).populate(
        "author",
        "pseudo email"
      );
      res.status(200).json({
        success: true,
        projet,
        reviews,
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
      let updateprojetData = {
        title,
        description,
        category,
      };
      const existCategory = await Category.findOne({ name: category.trim() });
      existCategory
        ? (updateprojetData.category_id = existCategory._id)
        : (updateprojetData.category_id = null);
      // Mettre à jour le projet
      Object.assign(projet, updateprojetData);
      /*      projet.title = updateprojetData.title ? title : projet.title;
      projet.category = updateprojetData.category ? category : projet.category;
      projet.description = updateprojetData.description
        ? description
        : projet.description;
      projet.category_id = updateprojetData.category_id; */

      await projet.save();

      // Populate l'auteur pour la réponse
      await projet.populate("author", "pseudo email");

      res.status(200).json({
        success: true,
        message: "Projet updated successfully",
        projet,
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

      if (
        adminrole !== "admin" &&
        projet.author.toString() !== req.user.id.toString()
      ) {
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
      const categories = await Category.find().select("name");
      res.status(200).json({
        success: true,
        categories: categories.map((cat) => cat.name),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ProjetController;
