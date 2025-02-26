import { body } from "express-validator";
import redis from "../../src/services/redis.service.js";
import userModel from "../models/user.js";
import { json } from "express";

export const registerUserValidation = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 3, max: 15 })
        .withMessage("Username must be between 3 and 15 characters")
        .custom((value) => value === value.toLowerCase())
        .withMessage("Username must be lowercase"),
    body('email')
        .isEmail()
        .withMessage("Email must be a valid email"),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

export const loginUserValidator = [
    body('email')
        .isEmail()
        .withMessage("Email must be a valid email"),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

export const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized, token missing or invalid" });
        }

        // Extract token
        const token = authHeader.split(" ")[1]; 
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const  isTokenBlackListed = await redis.get(`blacklist:${token}`)
            // Store user in Redis
            if(isTokenBlackListed){
                return res.status(401).send('token expird')
            }
        // Verify token
        const decoded = userModel.verifyToken(token);

        // Check if user exists in Redis cache
        let user = await redis.get(`user:${decoded._id}`);


        if (!user) {
            // If not in cache, fetch from DB
            user = await userModel.findById(decoded._id);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            await redis.set(`user:${decoded._id}`, JSON.stringify(user));
        } else {
            user = JSON.parse(user); // Parse Redis stored JSON
        }

        req.user = user;
        req.tokenData = {token ,...decoded}
        next(); // Proceed to next middleware or route handler

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
