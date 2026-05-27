import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const doctorAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch doctor from DB
        const doctor = await Doctor.findById(decoded.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Attach doctor to request
        req.doctor = doctor;

        next();

    } catch (err) {
        console.error('Error in doctorAuth middleware:', err);

        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token'
        });
    }
};