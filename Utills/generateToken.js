import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (id) => {
    const token = JsonWebTokenError.sign({_id:id},process.env.JWT_SECRET,{
        expiresIn:"1d",
    });
    return token;
};