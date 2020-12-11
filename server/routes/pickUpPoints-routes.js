const router= require('express').Router();
const PickUpPoint = require('../models/PickUpPoint');

// CREATE NEW PICKUP-POINT

/**
 * @swagger
 * /pickup/create:
 *   post:
 *     tags:
 *       - pickUpPoint
 *     description: used to create a pickUpPoint
 *     parameters:
 *       - name: pick_up_name
 *         in: requestBody
 *         description: pickUpPoint name
 *         type: String
 *       - name: address
 *         in: requestBody
 *         description: pickUpPoint address
 *         type: String
 *       - name: zip_code
 *         in: requestBody
 *         description: pickUpPoint zip_code
 *         type: Number
 *       - name: city
 *         in: requestBody
 *         description: pickUpPoint city
 *         type: String
 *       - name: phone
 *         in: requestBody
 *         description: pickUpPoint phone number
 *         type: Number
 *       - name: opening_hours
 *         in: requestBody
 *         description: pickUpPoint opening hours
 *         type: String
 *       - name: producer_name
 *         in: requestBody
 *         description: who is using the pickUpPoint
 *         type: String
 *       - name: payment_methods
 *         in: requestBody
 *         description: payment_methods allowed on the pickUpPoint
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 *       '500':
 *         description: Internal server error
 */


router.post('/create', async function (req, res) {
    const newPickUpPoint = new PickUpPoint({
        pick_up_name: req.body.pick_up_name,
        address: req.body.address,
        zip_code: req.body.zip_code,
        city: req.body.city,
        phone: req.body.phone,
        opening_hours: req.body.opening_hours,
        producer_name: req.body.producer_name,
        payment_methods: req.body.payment_methods
    });
    try {
        let pickUpPoint = await newPickUpPoint.save()
        return res.status(200).json({message: "New PickUpPoint successfully created!"});
    } catch (error) {
        return res.status(500).json({ message:"Sorry, something went wrong with your request"});
    }
});

// GET ALL PICKUP-POINT

/**
 * @swagger
 * /pickup/readall:
 *   get:
 *     tags:
 *       - pickUpPoint
 *     description: used to get all the existing pickUpPoint
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/readall',(req,res) => {
    PickUpPoint.find({}, function(err, result) {
        if (err) {
            return res.status(400).send({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send({data:result});
        }
    })
});

// GET PICK-UP-POINT BY ID

/**
 * @swagger
 * /pickup/read/{id}:
 *   get:
 *     tags:
 *       - pickUpPoint
 *     description: used to get one pickUpPoint using its id
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: pickUpPoint _id
 *         type: ObjectId
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.get('/read/:id', async (req, res) => {
    let result = await PickUpPoint.findOne({_id: req.params.id}).exec();
    if(!result) {
        return res.status(400).json({data: "Sorry, this pick-up point does not exist!"});
    }
    else
        return res.status(200).json(result);
});

// GET PICK UP POINTS FROM ONE PRODUCER

/**
 * @swagger
 * /pickup/readall/{producer}:
 *   get:
 *     tags:
 *       - pickUpPoint
 *     description: used to get one pickUpPoint from one producer
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

router.get('/readall/:producer',(req,res) => {
    PickUpPoint.find({producer_name: req.params.producer},null, {sort: {_id: -1}}, function (err, result) {
        if (err) {
            return res.status(400).send({data:"Sorry, something went wrong with your request"});
        } else {
            return res.status(200).send({data:result});
        }
    })
});


// UPDATE PICK UP POINT

/**
 * @swagger
 * /pickup/update/{id}:
 *   post:
 *     tags:
 *       - pickUpPoint
 *     description: used to update a pickUpPoint
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: pickUpPoint _id
 *         type: ObjectId
 *       - name: pick_up_name
 *         in: requestBody
 *         description: pickUpPoint name
 *         type: String
 *       - name: address
 *         in: requestBody
 *         description: pickUpPoint address
 *         type: String
 *       - name: zip_code
 *         in: requestBody
 *         description: pickUpPoint zip_code
 *         type: Number
 *       - name: city
 *         in: requestBody
 *         description: pickUpPoint city
 *         type: String
 *       - name: phone
 *         in: requestBody
 *         description: pickUpPoint phone number
 *         type: Number
 *       - name: opening_hours
 *         in: requestBody
 *         description: pickUpPoint opening hours
 *         type: String
 *       - name: payment_methods
 *         in: requestBody
 *         description: payment_methods allowed on the pickUpPoint
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful response
 */

router.post('/update/:id', async function(req,res) {
    PickUpPoint.findById(req.params.id, async function(err,pickUpPoint){
        if(req.body.pick_up_name){
            pickUpPoint.pick_up_name = req.body.pick_up_name
        }
        if(req.body.address){
            pickUpPoint.address = req.body.address
        }
        if(req.body.zip_code){
            pickUpPoint.zip_code = req.body.zip_code
        }
        if(req.body.city){
            pickUpPoint.city = req.body.city
        }
        if(req.body.opening_hours){
            pickUpPoint.opening_hours = req.body.opening_hours
        }
        if(req.body.phone){
            pickUpPoint.phone = req.body.phone
        }
        if(req.body.payment_methods){
            pickUpPoint.payment_methods = req.body.payment_methods
        }
        pickUpPoint.save();
        const message = " * pickUpPoint correctly updated ";
        return res.status(200).json({ message });
    });
});

// DELETE PICK UP POINT

/**
 * @swagger
 * /pickup/delete/{id}:
 *   post:
 *     tags:
 *       - pickUpPoint
 *     description: used to delete one pickUpPoint using its id
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: pickUpPoint _id
 *         type: ObjectId
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */

router.post('/delete/:id',function(req,res) {
    PickUpPoint.deleteOne({_id: req.params.id},function(err, result) {
        if (err) {
            return res.status(400).json({data: "Something went wrong with your request"});
        } else {
            return res.status(200).json({data:"PickUpPoint successfully remove from database"});
        }
    })
});

module.exports = router;
