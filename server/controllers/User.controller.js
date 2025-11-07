import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/util.js";
import Projet from "../models/Projet.model.js";
import mongoose from "mongoose";




const UserController = {
    register: async (req, res, next) => {
        try {
            const { pseudo, email, password, confirmPassword, role } = req.body;
            const existuser = await User.findOne({email})
            if(existuser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const user = await User.create({ pseudo, email, password , confirmPassword, role });
             res.status(201).json({
                success: true,
                message: "User created successfully",
                user: user,
            });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({email})
            if(!user) {
                return res.status(400).json({ message: "User not found" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return next(new Error("Invalid password"));
            }
            const token = generateToken(user);
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ msg: "success login!", user: user });

        } catch (error) {
            next(error);
        }
    },
    logout : async(req , res , next ) =>{
        res.clearCookie("token");
        res.status(200).json({ msg: "success logout!" });
    },
    getAllUsers : async(req, res, next) => {
        try {
            const users = await User.find().select("-password");
            res.status(200).json({ users });
        } catch (error) {
            next(error);
        }
    },
    deleteUser : async(req, res, next) => {
        try {
            const userToDelete = await User.findById(req.params.id).select("role");
            if (!userToDelete) {
                return res.status(404).json({ message: "User not found" });
            }
            if (userToDelete.role === "admin") {
                return res.status(403).json({ message: "Forbidden: cannot delete admin users" });
            }
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            next(error);
        }
    },
      getUserProjectsWithReviews: async (req, res, next) => {
      try {
        const userId = req.user.id;
        console.log(userId);
    
        const projects = await Projet.aggregate([
          { $match: { author: new mongoose.Types.ObjectId(userId) } },
          {
            $lookup: {
              from: 'reviews',           
              localField: '_id',         
              foreignField: 'projet',    
              as: 'reviews'      
            }
          }
        ]);
    
        if (!projects.length) {
          return res.status(404).json({ message: 'Aucun projet trouvé pour cet utilisateur' });
        }
    
        res.status(200).json({
          success: true,
          message: 'Projets et avis récupérés avec succès',
          projects,
        });
      } catch (error) {
        next(error);
      }
    }
    

};
export default UserController;