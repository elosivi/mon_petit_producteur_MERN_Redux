const router= require('express').Router();
const passport = require('passport');
const express = require('express');
const isAuthenticated = require('./check-routes');

// Password validator
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();
// Express validator (register)
const { check, validationResult } = require('express-validator');

const Consumer = require('../models/Consumers')
const Producers = require('../models/Producers');

passwordSchema
  .is().min(8)
  .is().max(40)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()

//This auth-routes do...
// register as consumer               ---> POST    .../auth/register        ---> last test postman:[23/06][elo]: ok, cf collection
// login with local strategy          ---> POST    .../auth/login           ---> last test postman:[23/06][elo]: ok, cf collection
// login with google                  ---> GET     .../auth/google          ---> last test postman:[date][name]: ok?
// logout                             ---> GET     .../auth/logout          ---> last test postman:[23/06][elo]: ok, cf collection

// test logged as?                    ---> GET     .../auth/me              ---> last test postman:[23/06][elo]: ok, cf collection

const CheckFormat =[
    check('login').notEmpty().withMessage('Login must not be empty'),
    check('login').isLength({ min: 5 }).withMessage('Login length must be more than 5 characters'),
    check('login').isLength({ max: 20 }).withMessage('Login length must be less than 20 characters'),
    check('email').notEmpty().withMessage('Email must not be empty'),
    check('email').isEmail().withMessage('Email must be at email format'),
    check('zip_code').notEmpty().withMessage('Zip Code must not be empty'),
    check('zip_code').isLength({ min: 5 }).withMessage('zipcode length must have 5 characters'),
    check('zip_code').isLength({ max: 5 }).withMessage('zipcode length must have 5 characters'),
    check('password').notEmpty().withMessage('Password must not be empty'),
    check('password').isLength({ min: 6 }).withMessage('Password length must be more than 6 characters'),
    check('password_confirmation').notEmpty().withMessage('Password confirmation must not be empty'),
    check('password_confirmation').isLength({ min: 6 }).withMessage('Password confirm length must be more than 6 characters too !'),
    ]

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - register
 *     description: used to register as a consumer
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: consumer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: consumer email
 *         type: String
 *       - name: zip_code
 *         in: requestBody
 *         description: consumer zip code
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: consumer password (will be hashed)
 *         type: String
 *       - name: password_confirmation
 *         in: requestBody
 *         description: consumer password confirmation
 *         type: String
 *     responses:
 *       '201':
 *         description: Consumer created
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post('/register',CheckFormat , async function (req, res) {
    console.log("--------------    r e g i s t e r       a s       c o n s u m e r --------------  [server][auth-routes.js]")
    console.log("request type is: ",req.is())
    console.log("request body: ",req.body)

    // Express validator errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const infos = errors.errors;
        return res.status(400).json({ message: infos[0].msg });
    }

    // Check password strength
    if (!passwordSchema.validate(req.body.password)) {
        console.log("test password quality");
        const message = "Password is not strong enough";
        return res.status(400).json({ message });
    }

    // Check password confirmation match
    if (req.body.password !== req.body.password_confirmation) {
        const message = "Passwords do not match";
        return res.status(400).json({ message });
    }

    // Make the new Consumer before insert into DB
    const newConsumer = new Consumer({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        zip_code: req.body.zip_code,
        is_admin: req.body.is_admin,
    });

    // Check if login already exists in DB
    let isLoginExist = true;
    try {
        isLoginExist = await Consumer.exists({ login: newConsumer.login })
        if (isLoginExist === true) {
            const message = "This login already exists";
            return res.status(400).json({ message });
        }
    } catch (error) {
        console.log(error);
        const message = "Internal Server Error";
        return res.status(500).json({ message });
    }

    // Check if email already exists in DB
    let isEmailExist = true;
    try {
        isEmailExist = await Consumer.exists({ email: newConsumer.email });
        if (isEmailExist === true) {
            return res.status(400).json("This email already exists");
        } 
    } catch (error) {
        const message = "Internal Server Error";
        return res.status(500).json({ message });
    } 

    // Save new consumer
    let user = null;
    try {
        user = await newConsumer.save()
        return res.status(201).json({
            message: "Consumer Created",
        });
        console.log(status)
    } catch (error) {
        const message = "Internal Server Error";
        return res.status(500).json({ message });        
    }
})

//----- register as producer ----
const CheckFormatProducer = [ 
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
    check('password_confirmation').notEmpty().withMessage('Password confirmation must not be empty'),
    check('password_confirmation').isLength({ min: 6 }).withMessage('Password confirm length must be more than 6 characters too !'),
    ]

/**
 * @swagger
 * /auth/register_producers:
 *   post:
 *     tags:
 *       - register
 *     description: used to register as a producer
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: producer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: producer email
 *         type: String
 *       - name: phone
 *         in: requestBody
 *         description: producer phone
 *         type: String
 *       - name: farmName
 *         in: requestBody
 *         description: producer farm name
 *         type: String
 *       - name: producerPresentation
 *         in: requestBody
 *         description: producer presentation
 *         type: String
 *       - name: farmPresentation
 *         in: requestBody
 *         description: producer farm presentation
 *         type: String
 *       - name: productsPresentation
 *         in: requestBody
 *         description: producer products presentation
 *         type: String
 *       - name: address
 *         in: requestBody
 *         description: producer address
 *         type: String
 *       - name: zip_code
 *         in: requestBody
 *         description: producer zip code
 *         type: String
 *       - name: city
 *         in: requestBody
 *         description: producer city
 *         type: String
 *       - name: gpsCoordinates
 *         in: requestBody
 *         description: producer city GPS coordinates
 *         type: Array
 *       - name: password
 *         in: requestBody
 *         description: producer password (will be hashed)
 *         type: String
 *       - name: password_confirmation
 *         in: requestBody
 *         description: consumer password confirmation
 *         type: String
 *     responses:
 *       '201':
 *         description: Producer created
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post('/register_producers',CheckFormatProducer,  async function (req, res) {

    //if admin
        console.log("-------------------- c r e a t e     a     p r o d u c e r     p r o f i l e  -------------------- [server][auth_routes]");
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
        if (req.body.password !== req.body.password_confirmation) {
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
                const message = " * This login already exists";
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
})

// =========================================== AUTH WITH OWN API "mon petit producteur" ==================================================== //

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - login
 *     description: used to login as a consumer
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: consumer login
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: consumer password
 *         type: String
 *     responses:
 *       '200':
 *         description: Consumer logged in
 *       '401':
 *         description: Unauthorized
 */
// ------ Auth as consumer -----//---> last test postman:[24/06][elo]: ok all routes tested
router.post('/login',
    passport.authenticate('consumer'),
    function (req, res) {
        console.log( "-------------------- l o c a l        l o g i n        c o n s u m e r --------------------[server][auth_routes.js]");
        console.log(" * auth with local strategy passport");//console test dev phase
        const message =  " * LOGGED as "+req.user.login+" / type: "+ req.user.type+ " / is admin: "+ req.user.is_admin 
        console.log(message);//console test dev phase
        return res.status(200).json(req.user)
    }
);

/**
 * @swagger
 * /auth/producersLogin:
 *   post:
 *     tags:
 *       - login
 *     description: used to login as a producer
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: producer login
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: producer password
 *         type: String
 *     responses:
 *       '200':
 *         description: producer logged in
 *       '401':
 *         description: Unauthorized
 */
// ------ Auth as producer -----//---> last test postman:[24/06][elo]: ok all routes tested
router.post('/producersLogin',
    passport.authenticate('producer'),
    function (req, res) {
        console.log( "-------------------- l o c a l        l o g i n        p r o d u c e r --------------------[server][auth_routes.js]");
        console.log(" * auth with local strategy passport");//console test dev phase
        const message =  " * LOGGED as "+req.user.login+" / type: "+ req.user.type+ " / is admin: "+ req.user.is_admin 
        console.log(message);//console test dev phase
        return res.status(200).json(req.user)
    }
);


// =========================================== L O G O U T  ==================================================== //

// Auth logout
router.get('/logout', (req, res) => {
    console.log("-------------------------- l o g o u t  --------------------         [server][auth-routes.js]");
    req.logout();
    res.json(" * User logged out");
});

// Profile
router.get('/me', isAuthenticated, function (req, res) {
    console.log(" * (.../me) I am logged as :", req.user.login,"             [server][auth-routes.js] ");
    res.json(req.user);
});

module.exports = router;

