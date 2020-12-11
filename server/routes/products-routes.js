const router= require('express').Router();
const Products = require('../models/Products');

// CREATE A PRODUCT

/**
 * @swagger
 * /products/create:
 *   post:
 *     tags:
 *       - products
 *     description: used to create a product
 *     parameters:
*       - name: product
 *         in: requestBody
 *         description: product name
 *         type: String
*       - name: author
 *         in: requestBody
 *         description: the author name
 *         type: String
 *       - name: author_id
 *         in: requestBody
 *         description: the author id
 *         type: Object ID
 *       - name: category
 *         in: requestBody
 *         description: the name of the category product
 *         type: String
 *       - name: conditioning
 *         in: requestBody
 *         description: the conditioning of the product
 *         type: String
 *       - name: stock
 *         in: requestBody
 *         description: is the product in stock
 *         type: String
 *       - name: price
 *         in: requestBody
 *         description: the product price
 *         type: Number
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.post('/create', async (req,res)=> {
    try {
        const newProduct = new Products({
            name: req.body.name,
            author: req.body.author,
            author_id:req.body.author_id,
            category: req.body.category,
            conditioning: req.body.conditioning,
            stock: req.body.stock,
            price: req.body.price
        });
        let product = await newProduct.save();
        return res.status(200).json({message: "Product "+ product.name + " successfully created!"});
    } catch (error) {
        res.status(400).send("Sorry, something went wrong during the creation process");
    }
});

// GET PRODUCT BY ID

/**
 * @swagger
 * /products/read/{id}:
 *   get:
 *     tags:
 *       - products
 *     description: used to get all one product using its id
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: product _id
 *         type: ObjectId
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/read/:id', async (req, res) => {
    let result = await Products.findOne({_id: req.params.id}).exec();
    if(!result) {
        return res.status(400).json({data: "Sorry, this product does not exist!"});
    }
    else
        return res.status(200).json(result);
});

// GET ALL PRODUCTS

/**
 * @swagger
 * /products/readall:
 *   get:
 *     tags:
 *       - products
 *     description: used to get all the existing products
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */


router.get('/readall',(req,res) => {
    Products.find({}, function(err, result) {
        if (err) {
            return res.status(400).json({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).json({data:result});
        }
    })
});

// GET ALL PRODUCTS FROM ONE PRODUCER (ORDER MOST RECENT TO LESS RECENT)

/**
 * @swagger
 * /products/readall/name/{producer}:
 *   get:
 *     tags:
 *       - products
 *     description: used to get all the products from one specific producer order from most recent to less recent
 *     parameters:
 *       - name: producer
 *         in: path
 *         description: producer login
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/readall/name/:producer', (req, res) => {
    Products.find({author: req.params.producer},null, {sort: {_id: -1}}, function (err, result) {
        if (err) {
            return res.status(400).send({data: "Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send(result);
        }
    })
});

// GET ALL PRODUCTS FROM ONE PRODUCER (ORDER MOST RECENT TO LESS RECENT)

/**
 * @swagger
 * /products/readall/id/{id}:
 *   get:
 *     tags:
 *       - products
 *     description: used to get all the products from one specific producer
 *     parameters:
 *       - name: producer _id
 *         in: path
 *         description: producer _id
 *         type: ObjectId
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/readall/id/:id', (req, res) => {
    Products.find({author_id: req.params.id},null, {sort: {_id: -1}}, function (err, result) {
        if (err) {
            return res.status(400).send({data: "Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send(result);
        }
    })
});

// GET ALL PRODUCTS FROM ONE CATEGORIE (ODER BY ALPHA)

/**
 * @swagger
 * /products/readall/category/{category}:
 *   get:
 *     tags:
 *       - products
 *     description: used to get all the products from one specific category
 *     parameters:
 *       - name: category
 *         in: path
 *         description: the category name
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/readall/category/:category', (req, res) => {
    Products.find({category: req.params.category},null, {sort: {name: -1}}, function (err, result) {
        if (err) {
            return res.status(400).send({data: "Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send(result);
        }
    })
});

// GET ALL PRODUCTS FROM ONE PRODUCER ORDERED BY INCREASING PRICE

/**
 * @swagger
 * /products/readall-by-increasing-price/{producer}:
 *   get:
 *     tags:
 *       - products
 *     description: used to get all the products by increasing price
 *     parameters:
 *       - name: producer
 *         in: path
 *         description: the producer login
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/readall-by-increasing-price/:producer', (req, res) => {
    Products.find({author: req.params.producer},null, {sort: {price:1}}, function (err, result) {
        if (err) {
            return res.status(400).send({data: "Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send(result);
        }
    })
});

// GET ALL PRODUCTS FROM ONE PRODUCER ORDERED BY DECREASING PRICE

/**
 * @swagger
 * /products/readall-by-decreasing-price/{producer}:
 *   get:
 *     tags:
 *       - products
 *     description: used to get all the products by decreasing price
 *     parameters:
 *       - name: producer
 *         in: path
 *         description: the producer login
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/readall-by-decreasing-price/:producer', (req, res) => {
    Products.find({author: req.params.producer},null, {sort: {price:-1}}, function (err, result) {
        if (err) {
            return res.status(400).send({data: "Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send(result);
        }
    })
});

// UPDATE PRODUCT

/**
 * @swagger
 * /products/update/{id}:
 *   post:
 *     tags:
 *       - products
 *     description: used to create a product
 *     parameters:
 *       - name: id
 *         in: path
 *         description: product id
 *         type: ObjectId
 *       - name: product
 *         in: requestBody
 *         description: product name
 *         type: String
 *       - name: category
 *         in: requestBody
 *         description: the name of the category product
 *         type: String
 *       - name: conditioning
 *         in: requestBody
 *         description: the conditioning of the product
 *         type: String
 *       - name: stock
 *         in: requestBody
 *         description: is the product in stock
 *         type: String
 *       - name: price
 *         in: requestBody
 *         description: the product price
 *         type: Number
 *     responses:
 *       '200':
 *         description: Successful response
 */

router.post('/update/:id', async function(req,res) {
    Products.findById(req.params.id, async function(err,product){
        if(req.body.name){
            product.name = req.body.name
        }
        if(req.body.category){
            product.category = req.body.category
        }
        if(req.body.conditioning){
            product.conditioning = req.body.conditioning
        }
        if(req.body.stock){
            product.stock = req.body.stock
        }
        if(req.body.price){
            product.price = req.body.price
        }
        product.save();
        const message = " * Product correctly updated ";
        return res.status(200).json({ message });
    });
});

// DELETE PRODUCT

/**
 * @swagger
 * /products/delete/{id}:
 *   post:
 *     tags:
 *       - products
 *     description: used to delete products from producer profile
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the product _id
 *         type: ObjectId
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */


router.post('/delete/:id',function(req,res) {
    Products.deleteOne({_id: req.params.id},function(err, result) {
        if (err) {
            return res.status(400).send({data: "Something went wrong with your request"});
        } else {
            return res.status(200).send("Categorie successfully remove from database");
        }
    })
});

module.exports = router;
