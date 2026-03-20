import express from "express";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
const port = process.env.PORT;

app.use('/', (req, res) => {
    res.send('Bienvenue sur l\'API du gestionnaire de banque !');
});

// Error 404 handler
app.use((_req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Bank manager API démarrée sur http://localhost:${port}`);
});