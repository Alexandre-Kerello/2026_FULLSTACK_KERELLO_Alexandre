import express from "express";

const app = express();
const port = process.env.PORT;

app.use('/', (req, res) => {
    res.send('Bienvenue sur l\'API du gestionnaire de banque !');
});

app.listen(port, () => {
    console.log(`Bank manager API démarrée sur http://localhost:${port}`);
});