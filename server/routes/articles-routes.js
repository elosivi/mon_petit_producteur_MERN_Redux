const router= require('express').Router();
const Articles = require('../models/Articles');
const Consumers = require('../models/Consumers');
const { check, validationResult } = require('express-validator');

const CheckFormat = [
    
    check('title').isLength({ max: 20 }).withMessage("Le titre est trop long, max 20 caractères"),
    check('content').notEmpty().withMessage("L'article ne peut pas être vide"),
    check('content').isLength({ min: 20 }).withMessage("L'article est trop court, min 20 caractères"),
    check('content').isLength({ max: 250 }).withMessage("L'article est trop long, max 250 caractères"),
]
// POST NEW ARTICLE
/**
 * @swagger
 * /articles/create:
 *   post:
 *     tags:
 *       - articles
 *     description: used to create an article
 *     parameters:
 *       - name: author
 *         in: requestBody
 *         description: the author name
 *         type: String
 *       - name: author_id
 *         in: requestBody
 *         description: the author id
 *         type: Object ID
 *       - name: title
 *         in: requestBody
 *         description: the article title
 *         type: String
 *       - name: content
 *         in: requestBody
 *         description: the article content
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post('/create',CheckFormat, async function (req, res) {
    console.log("---* create a new article * --- ")
    
    // Express validator errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
         const infos = errors.errors;
         console.log(infos[0].msg)
         return res.status(400).json({ message: infos[0].msg });
    }

    if (req.user.type === "producer") {
        const newArticle = new Articles({
            author: req.body.author,
            author_id: req.body.author_id,
            title: req.body.title,
            content: req.body.content
        });
        try {
            let article = await newArticle.save()
            return res.status(200).json({message: "Nouvel article crée !"});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message:"Sorry, something went wrong with your request"});
        }
    } else {
        return res.status(400).json({ message:"Désolé, seuls les producteurs peuvent poster des articles ..."});
    }
});

// GET ALL ARTICLES
/**
 * @swagger
 * /articles/readall:
 *   get:
 *     tags:
 *       - articles
 *     description: used to get all articles
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.get('/readall',(req,res) => {
    Articles.find({},null, {sort: {_id: -1}}, function(err, result) {
        if (err) {
            return res.status(400).send({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send({data:result});
        }
    })
});

// GET ARTICLE BY ID
/**
 * @swagger
 * /articles/read/{id}:
 *   get:
 *     tags:
 *       - articles
 *     description: used to get one specific article
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the article id
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/read/:id', async (req, res) => {
    let result = await Articles.findOne({_id: req.params.id}).exec();
    if(!result) {
        return res.status(400).json({data: "Désolé! Cet article n'existe pas!"});
    }
    else
        return res.status(200).json(result);
});

// GET ARTICLES FROM ONE PRODUCER
/**
 * @swagger
 * /articles/readall/{producer}:
 *   get:
 *     tags:
 *       - articles
 *     description: used to get all articles from a producer
 *     parameters:
 *       - name: producer
 *         in: path
 *         description: the producer id
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.get('/readall/:producer',(req,res) => {
    Articles.find({author_id: req.params.producer},null, {sort: {_id: -1}}, function (err, result) {
        if (err) {
            return res.status(400).send({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send({data:result});
        }
    })
});

// GET ARTICLES FROM FROM PRODUCERS FOLLOWED
/**
 * @swagger
 * /articles/get_mess/{login}:
 *   get:
 *     tags:
 *       - articles
 *     description: used to get articles from producer
 *     parameters:
 *       - name: login
 *         in: path
 *         description: the producer login
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/get_mess/:login', async (req, res) => {
    let member = await Consumers.findOne({_id:req.params.login}).exec();
    if (!member) {
        return res.status(400).json({data: "No User found!"});
    } else {
        let data = member.my_producers.map( function(element) {
            return element;
        });
        let match = await Articles.find({author_id:data},null, {sort: {_id: -1}});
        return res.status(200).json(match);
    }
});

// UPDATE ARTICLE

/**
 * @swagger
 * /articles/update/{id}:
 *   post:
 *     tags:
 *       - articles
 *     description: used to update articles from producer
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the producer _id
 *         type: ObjectId
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.post('/update/:id', CheckFormat,function(req,res) {
    // Express validator errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const infos = errors.errors;
        console.log(infos[0].msg)
        return res.status(400).json({ message: infos[0].msg });
    }

    Articles.updateOne({_id: req.params.id}, {$set:{content: req.body.content}}, {upsert: true}, function (err, result) {
        if (err) {
            return res.status(400).send({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send({data:"Votre article a été mis à jour, merci !"});
        }
    })
});

// DELETE ARTICLE

/**
 * @swagger
 * /articles/delete/{id}:
 *   post:
 *     tags:
 *       - articles
 *     description: used to delete articles from producer
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the producer _id
 *         type: ObjectId
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.post('/delete/:id',function(req,res) {
    Articles.deleteOne({_id: req.params.id},function(err, result) {
        if (err) {
            return res.status(400).json({data: "Something went wrong with your request"});
        } else {
            return res.status(200).json({data:"Votre article a été supprimé"});
        }
    })
});

module.exports = router;
