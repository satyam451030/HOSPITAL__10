import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';


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
    app.get('/', (req, res) => {
        res.json({ message: 'Backend is running' });
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();