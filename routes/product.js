const express=require("express")
const multer= require('multer')
const { isAuth, isAdmin }=require('../middlewares/isAuth')
const router=express.Router()
const Product=require("../models/Product")
const User=require("../models/User")

//upload image with multer

filename=""
const mystorage=multer.diskStorage({
    destination:'./uploads',
    filename:(req,file,redirect)=>{
       let  date= Date.now();
        let fl=date +"."+ file.mimetype.split('/')[1];
        //1257896655589.png
        redirect(null,fl);
        filename=fl;
    }

})

const upload= multer({storage:mystorage})



/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Liste des produits (recherche/tri)
 *     tags: [Produits]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: searchKeyword
 *         schema:
 *           type: string
 *         description: Mot-clé de recherche
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [lowest, highest]
 *         description: Trier par prix
 *     responses:
 *       200:
 *         description: Liste des produits
 */


//sherch
router.get('/', async (req, res) => {
    const category = req.query.category ? { category: req.query.category } : {};
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};
    const sortOrder = req.query.sortOrder
      ? req.query.sortOrder === 'lowest'
        ? { price: 1 }
        : { price: -1 }
      : { _id: -1 };
    const products = await Product.find({ ...category, ...searchKeyword }).sort(
      sortOrder
    );
    res.send(products);
  });


 /**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Succès
 */

  //get product
  router.get('/all', async (req, res) => {
    const products = await Product.find();
    if (products) {
      res.send(products);
    } else {
      res.status(404).send({ message: 'Products Not Found.' });
    }
  });


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Détails d'un produit
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du produit
 *       404:
 *         description: Produit non trouvé
 */

  //get productid
  router.get('/:id', async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found.' });
    }
  });

  /**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Ajouter un avis sur un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avis ajouté
 */

  //add review
  router.post('/:id/reviews', isAuth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const review = {
        name: req.body.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        message: 'Review saved successfully.',
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  });
  /**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Modifier un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               countInStock:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produit modifié
 */
  //edit product
 router.put('/:id', upload.single('image'), isAuth, isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({ message: 'Product Not Found' });
    }

    product.name = req.body.name;
    product.price = req.body.price;

    
    if (req.file) {
      product.image = req.file.filename;
    } else if (req.body.image) {
      
      product.image = req.body.image;
    }

    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    const updatedProduct = await product.save();
    res.status(200).send({ message: 'Product Updated', data: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error in Updating Product.' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprimé
 */

  //delete product
  router.delete('/:id', isAuth, isAdmin, async (req, res) => {
    const deletedProduct = await Product.findById(req.params.id);
    if (deletedProduct) {
      await deletedProduct.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.send('Error in Deletion.');
    }
  });


  /**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Créer un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               countInStock:
 *                 type: number
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *               numReviews:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produit créé
 */
  //create product
  router.post('/add',upload.single('image'), isAuth, isAdmin, async (req, res) => {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.file.filename,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    });
    const newProduct = await product.save();
    if (newProduct) {
      return res
        .status(201)
        .send({ message: 'New Product Created', data: newProduct });
    }
    return res.status(500).send({ message: ' Error in Creating Product.' });
  });
  
  module.exports=router;