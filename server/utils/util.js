import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const generateToken = (user) => {
    return jwt.sign({id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: "1h"});
};

export const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized: Token expired" });
            }
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin only can access this route" });
    }
    next();
};