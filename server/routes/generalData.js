// Packages
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const session = require('express-session')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Model files
const Producers = require('../models/Producers');
const Consumers = require('../models/Consumers');



// ================================s=====   r e a d    =====================================//

/**
 * @swagger
 * /general/HowManyProducers:
 *   get:
 *     tags:
 *       - general data
 *     description: used to get the exact number of producers register on our website
 *     responses:
 *       '200':
 *         description: Successful response
 *       '500':
 *         description: Bad request
 */


//  -------------get how many consommateurs ? producers? -----------------------
router.get('/HowManyProducers', function (req, res) {
    console.log("-------------------- * h o w    m a n y    p r o d u c e r s   -------------------- [server][CRUD_consumers]");
    Producers.find().exec(function (err, producers) {
        if (err) {
            const message = "Internal Server Error"
            console.log("==> ERROR ! ",err )
            return res.status(500).json({message});
        }
        let number = producers.length
        console.log("number: ", number)
        return res.status(200).json({ number });
    });
});

/**
 * @swagger
 * /general/HowManyConsumers:
 *   get:
 *     tags:
 *       - general data
 *     description: used to get the exact number of consumers register on our website
 *     responses:
 *       '200':
 *         description: Successful response
 *       '500':
 *         description: Bad request
 */


router.get('/HowManyConsumers', function (req, res) {
    console.log("-------------------- * h o w    m a n y    c o n s u m e r s  -------------------- [server][CRUD_consumers]");
    Consumers.find().exec(function (err, consumers) {
        if (err) {
            const message = "Internal Server Error"
            console.log("==> ERROR ! ",err )
            return res.status(500).json({message});
        }
        let number = consumers.length
        console.log("number: ", number)
        return res.status(200).json({ number });
    });
});


//  -------------datas about producers -----------------------
router.get('/AllProducers',  function (req, res) {
    console.log("-------------------- g e t     p ro d u c e r s   d a t a  -------------------- [generalData.js]");
    Producers.find().sort({creationDate: 'desc'}).exec(function (err, producers) {
        if (err) {
            const message = "Internal Server Error"
            console.log("==> ERROR ! ",err )
            return res.status(500).json({message});
        }
        console.log("==> YES ! get all by date: ",producers)
        return res.status(200).json({ producers});
    });
});


module.exports = router;