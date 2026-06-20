import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config({ override: true });

import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';
import doctorRouter from './routes/doctorRouter.js';
import serviceRouter from './routes/serviceRouter.js';
import appointmentRouter from './routes/appointmentRouter.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: true})); // For parsing application/x-www-form-urlencoded
app.use(clerkMiddleware());


// DB and server startup
const startServer = async () => {
    await connectDB();

    // Routes
    app.use("/api/doctors", doctorRouter);
    app.use("/api/services", serviceRouter);
    app.use("/api/appointments", appointmentRouter);
    app.use("/api/service-appointments",serviceAppointmentRouter);

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
        res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();