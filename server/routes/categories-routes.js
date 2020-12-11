const router= require('express').Router();
const Categories = require('../models/Categories');


// CREATE A CATEGORIE

/**
 * @swagger
 * /categories/create:
 *   post:
 *     tags:
 *       - categories
 *     description: used to create a category
 *     parameters:
 *       - name: category name
 *         in: requestBody
 *         description: category name
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '500':
 *         description: Internal server error
 */

router.post('/create', async function (req, res) {
    const newCategory = new Categories({
        name: req.body.name,
    });
    try {
        let category = await newCategory.save()
        return res.status(200).json({message: "Categorie: "+ category.name + ", créee avec succés !"});
    } catch (error) {
        return res.status(500).json({ message:"Sorry, something went wrong with your request. This category might already exist"});
    }
});

// GET ALL CATEGORIES

/**
 * @swagger
 * /categories/read:
 *   get:
 *     tags:
 *       - categories
 *     description: used to get all the categories
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/read',(req,res) => {
    Categories.find({}, function(err, result) {
        if (err) {
            return res.status(400).send({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send({data:result});
        }
    })
});

// UPDATE CATEGORIE

/**
 * @swagger
 * /categories/update/{id}:
 *   post:
 *     tags:
 *       - categories
 *     description: used to update a category
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: category id
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Internal server error
 */

router.post('/update/:id',function(req,res) {
    Categories.updateOne({_id: req.params.id}, {$set:{name: req.body.name}}, {upsert: true}, function (err, result) {
        if (err) {
            return res.status(400).send({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send({data:"Categorie mise a jour avec succès"});
        }
    })
});

// DELETE CATEGORIE

/**
 * @swagger
 * /categories/delete/{id}:
 *   post:
 *     tags:
 *       - categories
 *     description: used to delete a category
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: category id
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Internal server error
 */


router.post('/delete/:id',function(req,res) {
    Categories.deleteOne({_id: req.params.id},function(err, result) {
        if (err) {
            return res.status(400).json({data: "Something went wrong with your request"});
        } else {
            return res.status(200).json({data:"Categorie supprimée"});
        }
    })
});

module.exports = router;
