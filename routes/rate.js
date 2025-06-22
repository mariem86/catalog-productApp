const express=require("express")

const { isAuth }=require('../middlewares/isAuth')
const router=express.Router()
const Rate=require("../models/Rate")

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Gestion des avis/notes produits
 */

/**
 * @swagger
 * /api/rate/{id}/addrate:
 *   post:
 *     summary: Ajouter une note à un produit
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Données de la note
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Note enregistrée
 *       500:
 *         description: Erreur serveur
 */
// add Rating by client
router.post('/:id/addrate',(req,res)=>{
    const user =req.user
    const {rating }=req.body
    const product=req.params.id
   

    const rate= new Rate({user,rating,product})
     rate.save()
     .then(product=>res.send(product))
     .catch(err=>console.log(err))
          });
/**
 * @swagger
 * /api/rate/allrate:
 *   get:
 *     summary: Obtenir toutes les notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: Liste de toutes les notes
 *       500:
 *         description: Erreur serveur
 */
// get all Rate
router.get('/allrate',(req,res)=>{
    Rate.find()
    .then(products=>res.send(products))
    .catch(err=>console.log(err))
          });

          module.exports=router