const express = require("express");
const cors = require('cors');
const connectDB = require("./config/connectDB");
const path = require('path');
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const orderRoute = require('./routes/order');
const rateRouter = require("./routes/rate");
require("dotenv").config({ path: "./config/.env" });
const app = express();

// Swagger imports
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "eCommerce API",
      version: "1.0.0",
      description: "Documentation API pour l'application eCommerce",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
  },
  apis: ['./routes/*.js'], // Tes fichiers de routes avec les commentaires Swagger
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à la base de données
connectDB();

// Routes principales
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRoute);
app.use("/api/rate", rateRouter);

// Route Paypal
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Swagger routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Lancer le serveur
const port = process.env.PORT || 5001;
app.listen(port, (err) => {
  err
    ? console.log(err)
    : console.log(`The Server is Running on port ${port}....`);
});
