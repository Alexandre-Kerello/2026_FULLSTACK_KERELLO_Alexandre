import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import connectDB from "./config/db.js";
import authRoutes from "./modules/auth/auth.route.js";
import usersRoutes from "./modules/users/users.routes.js";

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());

// DB connection
connectDB();

// Routes 
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Error 404 handler
app.use((_req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Bank manager API démarrée sur http://localhost:${port}`);
});