# 📦 Product Catalog API

A modular, secure, and scalable backend for managing a product catalog using **Node.js**, **Express.js**, **MongoDB**, and **JWT**.

---

## ✅ Features

- Authentification (JWT, Bcrypt)
- CRUD Produits (avec auth product, reviews, rating)
- Uploads locaux d’images via Multer)
- Gestion des avis clients & notation
-  produits mis en avant
- Swagger pour la documentation de l’API
- Collection Postman incluse

---

## 🚀 Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/mariem86/product-catalog-api.git
cd product-catalog-api
2.Installer les dépendances
npm install

3.Configurer l’environnement

Copier le fichier .env.example en .env

Remplir les variables avec tes informations locales

4.Démarrer le serveur


nodemon server
Le serveur tourne sur http://localhost:5001 par défaut.
 Utilisation
Accès API : http://localhost:5001/api

Accès images : http://localhost:5001/uploads

Créer un utilisateur admin via /api/auth/createadmin

Tester avec Postman via la collection fournie

📄 Swagger Setup
L’interface Swagger est disponible sur :


http://localhost:5001/api-docs
Pour l’activer :

Installer Swagger UI


npm install swagger-ui-express
Ajouter dans app.js :


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
📁 .env.example

 Mongo_URI=mongodb://localhost:27017/EcommerceDB

SecretOrKey=MyTopSecret
accessKeyId=accessKeyId
secretAccessKey=secretAccessKey
PAYPAL_CLIENT_ID=PAYPAL_CLIENT_ID

