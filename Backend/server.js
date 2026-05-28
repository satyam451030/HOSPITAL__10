import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';
import doctorRouter from './routes/doctorRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors());
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: true})); // For parsing application/x-www-form-urlencoded
app.use(clerkMiddleware());


// DB and server startup
const startServer = async () => {
    await connectDB();

    // Routes
    app.use("/api/doctors", doctorRouter);


    app.get('/', (req, res) => {
        res.json({ message: 'Backend is running' });
    });

    // Error handler for invalid JSON and other express middleware errors
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON payload. Please send valid JSON in the request body.'
            });
        }

        console.error('Express error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();