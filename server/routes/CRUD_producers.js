// Packages
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const session = require('express-session')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Password validator
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();

// Model files
const Producers = require('../models/Producers');
const Consumers = require('../models/Consumers');

passwordSchema
    .is().min(8)
    .is().max(40)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()

//This CRUD , based on producer profil, do...

//check the user connected: req.user --> cf isAuthenticated passed in routes (index.js) + defined in check-routes.js

// create                          --->POST    .../admin/producers'                                                      ---> last test postman:[24/06][elo]: ok, cf collection
// read as producer / as admin     --->GET     .../producerProfile .../admin/producers/:producer_id? +../newProducers    ---> last test postman:[24/06][elo]: ok, cf collection : the 4 routes
// update as producer / as admin   --->PUT     .../producerProfile     .../admin/users/:producer_id?                     ---> last test postman:[24/06][elo]: ok, cf collection : the 4 routes
// delete as producer / as admin   --->DELETE  .../my profile          .../admin/users/:producer_id?                     ---> last test postman:[24/06][elo]: ok, cf collection : the 2 routes

// CheckFormat on each input in each request ---> last test postman:[24/06][elo]: create ok, update as prod ok, update as admin ok
// Check if data forced in update as producer (ex: to change grades not allowed as producer)   ------> last test postman:[24/06][elo], ok

// routes pretected as admin logged     ---> all access    ---> last test postman:[../..][elo]: ok all routes tested
// routes pretected as cons logged      ---> limit access  --->  last test postman:[../..][elo]: ok all routes tested
// routes pretected as visitor logged   ---> 0 access      ---> last test postman:[../..][elo]: ok all routes tested


const CheckFormat = [
    check('login').notEmpty().withMessage('Login must not be empty'),
    check('login').isLength({ min: 5 }).withMessage('Login length must be more than 5 characters'),
    check('login').isLength({ max: 20 }).withMessage('Login length must be less than 20 characters'),
    check('email').notEmpty().withMessage('Email must not be empty'),
    check('email').isEmail().withMessage('Email must be at email format'),
    check('phone').notEmpty().withMessage('Phone number must not be empty'),
    check('phone').isMobilePhone().withMessage('Phone number must be at phone format'),
    check('farmName').notEmpty().withMessage('Farm name must not be empty'),
    check('farmName').isLength({ min: 4 }).withMessage('Farm name length must be more than 4 characters'),
    check('farmName').isLength({ max: 30 }).withMessage('Farm name length must be less than 30 characters'),

    check('producerPresentation').notEmpty().withMessage('Presentation must not be empty'),
    check('producerPresentation').isLength({ min: 50 }).withMessage('Presentation length must be more than 50 characters'),
    check('producerPresentation').isLength({ max: 700 }).withMessage('Presentation length must be less than 700 characters'),
    check('farmPresentation').notEmpty().withMessage(' Presentation of your farm must not be empty'),
    check('farmPresentation').isLength({ min: 50 }).withMessage('Presentation of your farm length must be more than 50 characters'),
    check('farmPresentation').isLength({ max: 700 }).withMessage('Presentation of your farm length must be less than 700 characters'),
    check('productsPresentation').notEmpty().withMessage(' Presentation of your products must not be empty'),
    check('productsPresentation').isLength({ min: 50 }).withMessage('Presentation of your products length must be more than 50 characters'),
    check('productsPresentation').isLength({ max: 700 }).withMessage('Presentation of your products length must be less than 700 characters'),

    check('address').notEmpty().withMessage(' Address must not be empty'),
    check('zipCode').notEmpty().withMessage('Zip Code must not be empty'),
    check('zipCode').isNumeric().withMessage('Zip Code must be at zip code format'),
    check('zipCode').isLength({ min: 5 }).withMessage('zipcode length must have 5 characters'),
    check('zipCode').isLength({ max: 5 }).withMessage('zipcode length must have 5 characters'),

    check('city').notEmpty().withMessage(' City must not be empty'),

    check('gpsCoordinates').notEmpty().withMessage(' City must not be empty'),

    check('password').notEmpty().withMessage('Password must not be empty'),
    check('password').isLength({ min: 6 }).withMessage('Password length must be more than 6 characters'),
    check('confirm_password').notEmpty().withMessage('Password confirmation must not be empty'),
    check('confirm_password').isLength({ min: 6 }).withMessage('Password confirm length must be more than 6 characters too !'),
]

// =====================================  c r e a t e     as admin =====================================

// ---------------------------- as admin -----------------------

/**
 * @swagger
 * /admin/producers:
 *   post:
 *     tags:
 *       - producers
 *     description: used to create a producer as admin
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: the producer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: the producer email
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: the producer password
 *         type: String
 *       - name: confirm_password
 *         in: requestBody
 *         description: the producer confirm_password
 *         type: String
 *       - name: address
 *         in: requestBody
 *         description: the producer address
 *         type: String
 *       - name: city
 *         in: requestBody
 *         description: the producer city
 *         type: String
 *       - name: zipCode
 *         in: requestBody
 *         description: the producer zipCode
 *         type: Number
 *       - name: phone
 *         in: requestBody
 *         description: the producer phone
 *         type: String
 *       - name: farmName
 *         in: requestBody
 *         description: the producer farmName
 *         type: String
 *       - name: producerPresentation
 *         in: requestBody
 *         description: the producer Presentation
 *         type: String
 *       - name: farmPresentation
 *         in: requestBody
 *         description: the Farm Presentation
 *         type: String
 *       - name: toKnow
 *         in: requestBody
 *         description: the producer to Know
 *         type: String
 *       - name: productsPresentation
 *         in: requestBody
 *         description: the producer products presentation
 *         type: String
 *       - name: gpsCoordinates
 *         in: requestBody
 *         description: the producer gpsCoordinates
 *         type: Array
 *       - name: pickupPoint
 *         in: requestBody
 *         description: the producer pickupPoint
 *         type: Array
 *       - name: productsCategories
 *         in: requestBody
 *         description: the producer productsCategories
 *         type: Array
 *       - name: inChatEnabled
 *         in: requestBody
 *         description: the producer is in chat enabled ?
 *         type: Boolean
 *       - name: grades
 *         in: requestBody
 *         description: the producer grades
 *         type: Array
 *       - name: followers
 *         in: requestBody
 *         description: the producer list of followers
 *         type: Array
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.post(['/admin/producers'],CheckFormat,  async function (req, res) {

    //if admin
    if (req.user.is_admin == true ){
        console.log("-------------------- c r e a t e     a     p r o d u c e r     p r o f i l e     a s     a d m i n -------------------- [server][CRUD_producers]");
        console.log(" * request type: ", req.is())//test console dev phase
        console.log(" * request body as : ",req.body.login)

        // Express validator errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const infos = errors.errors;
            return res.status(400).json({ message: infos[0].msg });
        }

        // Check password strength
        if (!passwordSchema.validate(req.body.password)) {
            const message = " * Password is not strong enough";
            return res.status(400).json({ message });
        }

        // Check password confirmation match
        if (req.body.password !== req.body.confirm_password) {
            const message = " * Passwords do not match";
            return res.status(400).json({ message });
        }

        // Make the new Producer before insert into DB
        const newProducer = new Producers({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
            address:req.body.address,
            city:req.body.city,
            zipCode:req.body.zipCode,
            phone:req.body.phone,
            farmName:req.body.farmName,
            producerPresentation:req.body.producerPresentation,
            farmPresentation:req.body.farmPresentation,
            toKnow:req.body.toKnow,
            productsPresentation:req.body.productsPresentation,
            gpsCoordinates:req.body.gpsCoordinates,
            pickupPoint:req.body.pickupPoint,
            productsCategories:req.body.productsCategories,
            inChatEnabled:req.body.inChatEnabled,
            grades:req.body.grades,
            followers:req.body.followers,
            creationDate:new Date(),
            status:"accepted",
        });

        // Check if login already exists in DB
        let isLoginExist = true;
        try {
            isLoginExist = await Producers.exists({ login: newProducer.login })
            if (isLoginExist === true) {
                const message = " * This login already exists yahhhhhhhha";
                return res.status(400).json({ message });
            }
        } catch (error) {
            console.log(" * ERR! (Check if login already exists in DB):", error);
            const message = " * Check if login already exists in DB: Internal Server Error";
            return res.status(500).json({ message });
        }

        // Check if email already exists in DB
        let isEmailExist = true;
        try {
            isEmailExist = await Producers.exists({ email: newProducer.email });
            if (isEmailExist === true) {
                const message = " * This email already exists";
                return res.status(400).json(message);
            }
        } catch (error) {
            console.log(" * ERR! (Check if email already exists in DB):", error);
            const message = " * Check if email already exists in DB: Internal Server Error";
            return res.status(500).json({ message });
        }

        // Check if farm name already exists in DB
        let isFarmNameExist = true;
        try {
            isFarmNameExist = await Producers.exists({ farmName: newProducer.farmName });
            if (isFarmNameExist === true) {
                const message = " * This farm name already exists";
                return res.status(400).json(message);
            }
        } catch (error) {
            console.log(" * ERR! (Check if farm name already exists in DB):", error);
            const message = " * Check if farm name already exists in DB: Internal Server Error";
            return res.status(500).json({ message });
        }

        // Check if address already exists in DB
        let isAddressExist = true;
        try {
            isAddressExist = await Producers.exists({ address: newProducer.address });
            if (isAddressExist === true) {
                const message = " * This address already exists";
                return res.status(400).json(message);
            }
        } catch (error) {
            console.log(" * ERR! (Check if address already exists in DB):", error);
            const message = " * Check if address already exists in DB: Internal Server Error";
            return res.status(500).json({ message });
        }


        // Save new producer
        let producer = null;
        try {
            producer = await newProducer.save()
            return res.status(201).json({
                message: "Producer " +producer.login +" created under id: "+producer._id+", farm name : "+producer.farmName,
            });
        } catch (error) {
            const message = " * Save a new producer : Internal Server Error";
            console.log(message, error);
            return res.status(500).json({ message });
        }
    }else{
        const message = "You're not logged as admin, this route is forbidden"
        return res.status(500).json({message});
    }
})


// =====================================   r e a d   as producer / as admin =====================================

/**
 * @swagger
 * /HowManyProducers:
 *   get:
 *     tags:
 *       - producers
 *     description: used to get number of producers
 *     responses:
 *       '200':
 *         description: Successful request
 *       '500':
 *         description: Internal server error
 */

router.get('/HowManyProducers', function (req, res) {
    console.log("-------------------- h o w    m a n y    p r o d u c e r s   -------------------- [server][CRUD_consumers]");
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

// ---------------------------- as admin -----------------------

/**
 * @swagger
 * /admin/producers/{producer_id}:
 *   get:
 *     tags:
 *       - producers
 *     description: used to get a producer profile as admin
 *     parameters:
 *       - name: producer_id
 *         in: path
 *         description: the producer ID
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.get('/admin/producers/:producer_id',  function (req, res) {
    const producer_id=req.params.producer_id;
    console.log("-------------------- g e t     a     p r o d u c e r     p r o f i l e  -------------------- [server][CRUD_producers]");
    if (!producer_id) {
        Producers.find().sort({login: 'asc'}).exec(function (err, producers) {
            if (err) {
                const message = "Internal Server Error"
                console.log("==> ERROR ! ", err)
                return res.status(500).json({message});
            }
            // console.log("==> YES ! [server] Producers: get all users from admin status ")
            return res.status(200).json({producers});
        });
    }
    if(producer_id){
        Producers.findOne({_id:producer_id}, function (err, producer) {
            if (err) {
                const message = "Internal Server Error"
                console.log("==> ERROR ! "+message ,"error:", err)
                return res.status(500).json({message});
            }
            return res.status(200).json({ producer });
        });
    }else{
        const message = "You're not logged as admin, this route is forbidden"
        return res.status(400).json({message});
    }
});

/**
 * @swagger
 * /newProducers:
 *   get:
 *     tags:
 *       - producers
 *     description: used to get all producer profile 
 *     responses:
 *       '200':
 *         description: Successful request
 *       '500':
 *         description: Internal server error
 */

router.get('/newProducers',  function (req, res) {
    console.log("-------------------- g e t     a     p r o d u c e r     p r o f i l e      a s     a d m i n -------------------- [server][CRUD_producers]");
    Producers.find().sort({creationDate: 'desc'}).exec(function (err, producers) {
        if (err) {
            const message = "Internal Server Error"
            console.log("==> ERROR ! ",err )
            return res.status(500).json({message});
        }
        console.log("==> YES ! get all by date: ")
        return res.status(200).json({ producers});
    });
});

// ----------------------------------------------------------- as producer ------------------------------------------------------------//

/**
 * @swagger
 * /producers/myProfile:
 *   get:
 *     tags:
 *       - producers
 *     description: used to get my producer profile 
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.get('/producers/myProfile',  function (req, res) {
    console.log("-------------------- g e t     m y     p r o d u c e r     p r o f i l e  -------------------- [server][CRUD_producers]");
    if (req.user.type == 'producer') {
        Producers.findOne({_id:req.user._id}, function (err, producerProfile) {
            if (err) {
                const message = "Internal Server Error"
                console.log("==> ERROR ! "+message ,"error:", err )
                return res.status(500).json({message});
            }
            return res.status(200).json({ producerProfile });
        });
    }else{
        const message = "You can't access to this profile if is not yours";
        return res.status(400).json({ message });
    }

});


// =====================================   u p d a t e    as  producer   /   as admin  =====================================


// ---------------------------- as producer -----------------------

/**
 * @swagger
 * /producers/myProfile:
 *   put:
 *     tags:
 *       - producers
 *     description: used to update my producer profile
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: the producer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: the producer email
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: the producer password
 *         type: String
 *       - name: confirm_password
 *         in: requestBody
 *         description: the producer confirm_password
 *         type: String
 *       - name: address
 *         in: requestBody
 *         description: the producer address
 *         type: String
 *       - name: city
 *         in: requestBody
 *         description: the producer city
 *         type: String
 *       - name: zipCode
 *         in: requestBody
 *         description: the producer zipCode
 *         type: Number
 *       - name: phone
 *         in: requestBody
 *         description: the producer phone
 *         type: String
 *       - name: farmName
 *         in: requestBody
 *         description: the producer farmName
 *         type: String
 *       - name: producerPicture
 *         in: requestBody
 *         description: the producer Picture
 *         type: String
 *       - name: farmPicture
 *         in: requestBody
 *         description: the farm Picture
 *         type: String
 *       - name: productsPicture
 *         in: requestBody
 *         description: the products Picture
 *         type: String
 *       - name: producerPresentation
 *         in: requestBody
 *         description: the producer Presentation
 *         type: String
 *       - name: farmPresentation
 *         in: requestBody
 *         description: the Farm Presentation
 *         type: String
 *       - name: toKnow
 *         in: requestBody
 *         description: the producer to Know
 *         type: String
 *       - name: productsPresentation
 *         in: requestBody
 *         description: the producer products presentation
 *         type: String
 *       - name: gpsCoordinates
 *         in: requestBody
 *         description: the producer gpsCoordinates
 *         type: Array
 *       - name: pickupPoint
 *         in: requestBody
 *         description: the producer pickupPoint
 *         type: Array
 *       - name: productsCategories
 *         in: requestBody
 *         description: the producer productsCategories
 *         type: Array
 *       - name: inChatEnabled
 *         in: requestBody
 *         description: the producer is in chat enabled ?
 *         type: Boolean
 *       - name: virtualVisit
 *         in: requestBody
 *         description: the producer virtual Visit
 *         type: Array
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.put('/producers/myProfile',  CheckFormat, async function (req, res) {

    //if producer or admin connected
    if ( (req.user.type == 'producer') || (req.user.is_admin == true ) ) {
        console.log("-------------------- u p d a t e     m y     p r o d u c e r     p r o f i l e  --------------------[server][CRUD_producers]");
        console.log("req body : ", req.body, "from : ", req.user.login);
        // Express validator errors
        const errors = validationResult(req);
        // Check password strength
        if ((req.body.password) && (!passwordSchema.validate(req.body.password)) ) {
            console.log("test password quality");
            const message = "Password is not strong enough";
            return res.status(400).json({ message });
        }
        //check password == confirm_password
        if ((req.body.password) && (req.body.password !== req.body.confirm_password) ) {
            const message = "Passwords do not match";
            return res.status(400).json({ message });
        }

        console.log("++++ DEBUG req.body ++++", req.body);

        //put new data
        const updateProducer = new Producers({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
            address:req.body.address,
            city:req.body.city,
            zipCode:req.body.zipCode,
            phone:req.body.phone,
            farmName:req.body.farmName,
            producerPicture: req.body.producerPicture,
            farmPicture: req.body.farmPicture,
            productsPicture: req.body.productsPicture,
            producerPresentation:req.body.producerPresentation,
            farmPresentation:req.body.farmPresentation,
            productsPresentation:req.body.productsPresentation,
            toKnow:req.body.toKnow,
            gpsCoordinates:req.body.gpsCoordinates,
            pickupPoint:req.body.pickupPoint,
            productsCategories:req.body.productsCategories,
            inChatEnabled:req.body.inChatEnabled,
            virtualVisit:req.body.virtualVisit,
        });



        // Check if login already exists in DB
        const isLoginExist = await Producers.exists({ login: updateProducer.login })
            .then((isLogin) => {
                return isLogin;
            })
            .catch((error) => {
                console.log(" * ERR! Check if login already exists in DB: ", error)
                return error;
            })
        if (isLoginExist === true) {
            const message = "This login already exists ouppsssssss";
            return res.status(400).json({ message });
        } else if (isLoginExist !== false) {
            const message = "Internal Server Error"
            return res.status(500).json({message});
        }

        // Check if email already exists in DB
        const isEmailExist = await Producers.exists({ email: updateProducer.email })
            .then((isEmail) => {
                return isEmail;
            })
            .catch((error) => {
                console.log(" * ERR! Check if email already exists in DB: ", error)
                return error;
            })

        if (isEmailExist === true) {
            const message = "This email already exists"
            return res.status(400).json({message});
        } else if (isEmailExist !== false) {
            const message = "Internal Server Error"
            return res.status(500).json({message});
        }

        //everything checked -> update producer data in db only with input not empty
        Producers.findById(req.user._id, async function(err,producer){
            if(req.body.login){
                producer.login = req.body.login;
            }
            if(req.body.password){
                producer.password = req.body.password;
            }
            if(req.body.zipCode){
                producer.zipCode = req.body.zipCode;
            }
            if(req.body.email){
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
                    producer.email = req.body.email;
                }else{
                    const message="email is not valid"
                    return res.status(400).json({message});
                }
            }
            if(req.body.address){
                producer.address = req.body.address;
            }
            if(req.body.city){
                producer.city = req.body.city;
            }
            if(req.body.phone){
                producer.phone = req.body.phone;
            }
            if(req.body.farmName){
                producer.farmName = req.body.farmName;
            }
            if(req.body.producerPresentation){
                producer.producerPresentation = req.body.producerPresentation;
            }
            if(req.body.farmPresentation){
                producer.farmPresentation = req.body.farmPresentation;
            }
            if(req.body.productsPresentation){
                producer.productsPresentation = req.body.productsPresentation;
            }
            if(req.body.toKnow){
                producer.toKnow = req.body.toKnow;
            }
            if(req.body.gpsCoordinates){
                producer.gpsCoordinates = req.body.gpsCoordinates;
            }
            if(req.body.pickupPoint){
                producer.pickupPoint = req.body.pickupPoint;
            }
            if(req.body.productsCategories){
                producer.productsCategories = req.body.productsCategories;
            }
            if(req.body.inChatEnabled){
                producer.inChatEnabled = req.body.inChatEnabled;
            }
            if(req.body.virtualVisit){
                producer.virtualVisit = req.body.virtualVisit;
            }

            producer.save();
            const message = " * Producer correctly updated ";
            return res.status(200).json({ message });
        });

    }else{
        const message = " * You can't update this profile if it is not yours";
        return res.status(400).json({ message });
    }
});


// ---------------------------- as admin -----------------------

/**
 * @swagger
 * /producers/{producer_id}:
 *   put:
 *     tags:
 *       - producers
 *     description: used to update a producer profile as admin
 *     parameters:
 *       - name: producer_id
 *         in: path
 *         description: the producer ID
 *         type: Object ID
 *       - name: login
 *         in: requestBody
 *         description: the producer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: the producer email
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: the producer password
 *         type: String
 *       - name: confirm_password
 *         in: requestBody
 *         description: the producer confirm_password
 *         type: String
 *       - name: address
 *         in: requestBody
 *         description: the producer address
 *         type: String
 *       - name: city
 *         in: requestBody
 *         description: the producer city
 *         type: String
 *       - name: zipCode
 *         in: requestBody
 *         description: the producer zipCode
 *         type: Number
 *       - name: phone
 *         in: requestBody
 *         description: the producer phone
 *         type: String
 *       - name: farmName
 *         in: requestBody
 *         description: the producer farmName
 *         type: String
 *       - name: producerPresentation
 *         in: requestBody
 *         description: the producer Presentation
 *         type: String
 *       - name: farmPresentation
 *         in: requestBody
 *         description: the Farm Presentation
 *         type: String
 *       - name: toKnow
 *         in: requestBody
 *         description: the producer to Know
 *         type: String
 *       - name: productsPresentation
 *         in: requestBody
 *         description: the producer products presentation
 *         type: String
 *       - name: gpsCoordinates
 *         in: requestBody
 *         description: the producer gpsCoordinates
 *         type: Array
 *       - name: pickupPoint
 *         in: requestBody
 *         description: the producer pickupPoint
 *         type: Array
 *       - name: productsCategories
 *         in: requestBody
 *         description: the producer productsCategories
 *         type: Array
 *       - name: inChatEnabled
 *         in: requestBody
 *         description: the producer is in chat enabled ?
 *         type: Boolean
 *       - name: grades
 *         in: requestBody
 *         description: the producer grades
 *         type: Array
 *       - name: followers
 *         in: requestBody
 *         description: the producer followers
 *         type: Array
 *       - name: virtualVisit
 *         in: requestBody
 *         description: the producer virtual Visit
 *         type: Array
 *       - name: status
 *         in: requestBody
 *         description: the producer status
 *         type: String
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.put('/producers/:producer_id', CheckFormat, async function (req, res) {
    //if admin
    const id = req.param.producer_id
    if (req.user.is_admin == true ){
        console.log("-------------------- u p d a t e     a     p r o d u c e r     p r o f i l e      a s    a d m i n --------------------[server][CRUD_producers]");
        console.log(" * id to update: ",req.param.producer_id )

        // Check password strength
        if ( (req.body.password) && (!passwordSchema.validate(req.body.password)) ){
            console.log("Password is not strong enough");
            const message = "Password is not strong enough";
            return res.status(400).json({ message });
        }

        // if (req.user.is_admin == true){
        if ((req.body.password) && (req.body.password !== req.body.confirm_password)) {
            const message = "Passwords do not match";
            return res.status(400).json({ message });
        }
        //put new data
        console.log(" * req.body: ",req.body )
        const updateProducer = new Producers({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
            address:req.body.address,
            city:req.body.city,
            zipCode:req.body.zipCode,
            phone:req.body.phone,
            farmName:req.body.farmName,
            producerPresentation:req.body.producerPresentation,
            farmPresentation:req.body.farmPresentation,
            productsPresentation:req.body.productsPresentation,
            toKnow:req.body.toKnow,
            gpsCoordinates:req.body.gpsCoordinates,
            pickupPoint:req.body.pickupPoint,
            productsCategories:req.body.productsCategories,
            inChatEnabled:req.body.inChatEnabled,
            grades:req.body.grades,
            followers:req.body.followers,
            virtualVisit:req.body.virtualVisit,
            status:req.body.status,
        });

        // Check if login already exists in DB
        if(req.body.login){
            const isLoginExist = await Producers.exists({ login: updateProducer.login })
                .then((isLogin) => {
                    return isLogin;
                })
                .catch((error) => {
                    console.log(" * ERR! Check if login already exists in DB: ", error)
                    return error;
                })
            if (isLoginExist === true) {
                const message = "This login already exists youhouuuuuuuuuuuuu";
                return res.status(400).json({ message });
            } else if (isLoginExist !== false) {
                const message = "Internal Server Error"

                return res.status(500).json({message});
            }
        }

        // Check if email already exists in DB
        if(req.body.email){
            const isEmailExist = await Producers.exists({ email: updateProducer.email })
                .then((isEmail) => {
                    return isEmail;
                })
                .catch((error) => {
                    console.log(" * ERR! Check if email already exists in DB: ", error)
                    return error;
                })

            if (isEmailExist === true) {
                const message = "This email already exists"
                return res.status(400).json({message});
            } else if (isEmailExist !== false) {
                const message = "Internal Server Error"
                return res.status(500).json({message});
            }
        }
        Producers.findById(req.params.producer_id,function(err,producer){
            if(req.body.login){
                producer.login = req.body.login;
            }
            if(req.body.password){
                producer.password = req.body.password;
            }
            if(req.body.zip_code){
                producer.zip_code = req.body.zip_code;
            }
            if(req.body.email){
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
                    producer.email = req.body.email;
                }else{
                    const message="email is not valid"
                    return res.status(400).json({message});
                }
            }
            if(req.body.address){
                producer.address = req.body.address;
            }
            if(req.body.city){
                producer.city = req.body.city;
            }
            if(req.body.phone){
                producer.phone = req.body.phone;
            }
            if(req.body.farmName){
                producer.farmName = req.body.farmName;
            }
            if(req.body.producerPresentation){
                producer.producerPresentation = req.body.producerPresentation;
            }
            if(req.body.farmPresentation){
                producer.farmPresentation = req.body.farmPresentation;
            }
            if(req.body.productsPresentation){
                producer.productsPresentation = req.body.productsPresentation;
            }
            if(req.body.toKnow){
                producer.toKnow = req.body.toKnow;
            }
            if(req.body.gpsCoordinates){
                producer.gpsCoordinates = req.body.gpsCoordinates;
            }
            if(req.body.pickupPoint){
                producer.pickupPoint = req.body.pickupPoint;
            }
            if(req.body.productsCategories){
                producer.productsCategories = req.body.productsCategories;
            }
            if(req.body.inChatEnabled){
                producer.inChatEnabled = req.body.inChatEnabled;
            }
            if(req.body.grades){
                producer.grades = req.body.grades;
            }
            if(req.body.followers){
                producer.followers = req.body.followers;
            }
            if(req.body.virtualVisit){
                producer.virtualVisit = req.body.virtualVisit;
            }
            if(req.body.status){
                if( (req.body.status == "waiting") || (req.body.status == "accepted") ||(req.body.status == "refused")){
                    producer.status = req.body.status;
                }else{
                    const message = "Status must be 'waiting' or 'accepted' or 'refused' only";
                    return res.status(400).json({ message });
                }

            }
            producer.save();
            const message = "Producers updated"
            return res.status(200).json({ message, updateProducer });
        });

    }else{
        const message = "You can't update this profile if you are not admin";
        return res.status(400).json({ message });
    }
});



// ----------------------------------------------   d e l e t e    --------------------------------------------------

// ---------------------------- as producer -----------------------

/**
 * @swagger
 * /producers/myProfile:
 *   delete:
 *     tags:
 *       - producers
 *     description: used to delete my producer profile
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.delete('/producers/myProfile',  function (req, res) {
    //if producer or admin connected
    if ( (req.user.type == 'producer') || (req.user.is_admin == true ) )  {
        //delete one
        console.log("-------------------- d e l e t e      m y     p r o f i l e    --------------------[server][CRUD_producers]");
        Producers.findOneAndDelete({ _id:req.user._id}, function (err, consumerToDelete) {
            if (err) {
                const message = "Internal Server Error"
                return res.status(500).json({message});
            }
            // Check consume existence
            if (!consumerToDelete) {
                const message = "Producers not found";
                return res.status(400).json({ message });
            } else{
                const message = "Producer deleted: ";
                return res.status(200).json({ message, consumerToDelete });
            }
        });
    }else{
        const message = "You can't delete this profile if it is not yours";
        return res.status(400).json({ message });
    }
});

// ---------------------------- as admin -----------------------

/**
 * @swagger
 * /admin/producers/{producer_id}:
 *   delete:
 *     tags:
 *       - producers
 *     description: used to delete a producer profile as admin
 *     parameters:
 *       - name: producer_id
 *         in: path
 *         description: the producer ID
 *         type: Object ID
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */


router.delete('/admin/producers/:producer_id',  function (req, res) {

    //if admin
    if (req.user.is_admin == true){
        console.log("-------------------- d e l e t e     a     p r o d u c e r     p r o f i l e      a s    a d m i n --------------------[server][CRUD_producers]");
        const id = req.params.producer_id

        //delete one
        Producers.findOneAndDelete({ _id: id }, function (err, producer) {
            if (err) {
                const message = "Internal Server Error"
                return res.status(500).json({message});
            }
            // Check producer existence
            if (!producer) {
                const message = "Producer not found";
                return res.status(400).json({ message });
            } else {
                const message = "Producer deleted";
                return res.status(201).json({ message, producer });
            }
        });
    }else{
        const message = "You're not logged as admin, this route is forbidden"
        return res.status(400).json({message});
    }
});

/**
 * @swagger
 * /getconsumersinfos:
 *   get:
 *     tags:
 *       - producers
 *     description: used to get followers infos
 *     responses:
 *       '200':
 *         description: Successful request
 */

router.get('/getconsumersinfos', async (req, res) => {
    let data = req.user.followers.map( function(element) {
        return element;
    });
    let match = await Consumers.find({_id:data},null, {sort: {_id: -1}});
    return res.status(200).json(match);
});

// =====================================   g r a d e s =====================================



// ---------------------------- read grades and render an average  -----------------------

/**
 * @swagger
 * /averageGrades/{producer_id}:
 *   get:
 *     tags:
 *       - producers
 *     description: used to get average grades for current producer
 *     parameters:
 *       - name: producer_id
 *         in: path
 *         description: the producer ID
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful request
 *       '500':
 *         description: Internal server error
 */

router.get('/averageGrades/:producer_id?', function (req, res) { 
    const producer_id=req.params.producer_id
    console.log("-------------------- g e t     m y     g r a d e   -------------------- [server][CRUD_producers]");
    console.log(" * /grades of ",producer_id)
        Producers.findOne({_id:producer_id}, function (err, producerProfile) {
            if (err) {
                const message = "Internal Server Error"
                console.log("==> ERROR ! "+message ,"error:", err )
                return res.status(500).json({message});
            }
            let grades=producerProfile.grades
            console.log( " * grades of: ",producerProfile)
            let sum = 0;
            let avg = 0;
            for (let i = 0; i < grades.length; i++){
                sum += parseFloat(grades[i]); 
                avg = sum/grades.length;
            }
            const avgGrades = avg.toFixed(1)
            const sumVoters = grades.length
            console.log("avg : ", avg, " ---> ",avgGrades);
            return res.status(200).json({ grades, avgGrades, sumVoters });
        });
});


// ---------------------------- add a grade as consumer -----------------------

/**
 * @swagger
 * /addAGrade/{producer_id}:
 *   post:
 *     tags:
 *       - producers
 *     description: used to add a grade as consumer
 *     parameters:
 *       - name: producer_id
 *         in: path
 *         description: the producer ID
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.post("/addAGrade/:producer_id?", function (req, res) { 
    console.log("-------------------- a d d     a     g r a d e     --------------------[server][CRUD_producers]");
    const producer_id = req.params.producer_id;
    console.log(req.body)
    const rawGrade =  req.body.grade;
    const grade= parseFloat(rawGrade).toFixed(1);
    console.log("consumer logged._id: ",req.user._id, " add a grade ",rawGrade, "to producer: ",producer_id)

    //verify if grade is under or egal than 5
    if(!req.user){
        const message = " You must be logged as consumer";
        console.log("message")
        return res.status(400).json({ message });
    }
    if( (req.body.grade>5) || (req.body.grade<0)){
        const message = " Grade must be between 0 and 5 only";
        console.log("message")
        return res.status(400).json({ message });
    }else if ((req.body.grade<=5) && (req.body.grade>=0)){
        console.log(" * format ok, grade to add: ",grade)
    }else{
        const message = " Smt wrong with the format of the grade";
        console.log("message")
        return res.status(400).json({ message });
    }
    Producers.findOne( {_id:producer_id , gradesConsId:req.user._id}, function(err,producer){
        if(producer){
            const mess=" * Vous avez déjà noté "+producer.login+" ! *";
            console.log(producer.gradesConsId +"  -> "+ mess)
            return res.status(400).json({ mess });
        }else{
            Producers.findById(  producer_id , function(err,producer){
                if(!producer){
                    message=" * producer with this id: "+producer_id +"doesn't find "
                    console.log(message);
                    return res.status(400).json({ message });
                }
                if(err){
                    message = " * message : "+ err
                    console.log(message);
                    return res.status(500).json({ message }); 
                }
                if(producer){
                    console.log(" --------> grade",grade)
                    producer.grades.push(grade);
                    producer.gradesConsId.push(req.user._id)
                    producer.save(function(err){
                        if (err){
                            message=" * error saving new grade: "+err
                            console.log(message)
                            return res.status(500).json({ message});  
                        }
                    });  
                    const message = "Votre note de "+grade+" a bien été attribuée à "+producer.login+" !"
                    console.log(message)
                    return res.status(200).json({ message });  
                      
                }
            });   
        }
    });
})

// ---------------------------- remove all the grades  -----------------------

/**
 * @swagger
 * /RemoveAllGrades/{producer_id}:
 *   post:
 *     tags:
 *       - producers
 *     description: used to remove all the grades
 *     parameters:
 *       - name: producer_id
 *         in: path
 *         description: the producer ID
 *         type: Object ID
 *     responses:
 *       '201':
 *         description: Created
 *       '500':
 *         description: Internal server error
 */

router.post("/RemoveAllGrades/:producer_id?", function (req, res) { 
    console.log("-------------------- r e m o v e     a l l    g r a d e s    --------------------[server][CRUD_producers]");
    const producer_id = req.params.producer_id;

    Producers.findOne( {_id : producer_id }, function(err,producer){
        if(!producer){
            console.log(" *producer with this id: ",producer_id ,"doesn't find ");
            return res.status(500).json({ message });
        }
        if(err){
            console.log(" * message : ", err);
            return res.status(500).json({ message }); 
        }
        if(producer){
            producer.grades=[];
            producer.gradesConsId=[];
            producer.save(function(err){
                if (err){
                    console.log(" * error saving new favorite product: ",err)
                }
            });  
            const message = "All grades & voters have been removed  !";
            grades = producer.grades;
            return res.status(201).json({ message,grades });  
              
        }
    })
})






module.exports = router;

