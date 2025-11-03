import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (request, response, next) => {
    const token = request.header.authorization?.split(" ")[1];

    if (!token) {
        return response.status(400).json({ message: "Access Denied. There is No token provided." });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();
    } catch(err){
        response.status(400).json({message:"Invalid Token"});
    }
};