import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";
import connectDB from "./config/db.js";
import authRoutes from "./modules/auth/auth.route.js";
import usersRoutes from "./modules/users/users.routes.js";
import accountsRoutes from "./modules/accounts/accounts.route.js";
import transactionsRoutes from "./modules/transactions/transactions.route.js";

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// DB connection
connectDB();

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionsRoutes);

// Error 404 handler
app.use((_req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Bank manager API démarrée sur http://localhost:${port}`);
});