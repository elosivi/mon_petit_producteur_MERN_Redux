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
const Consumers = require('../models/Consumers');
const Producers = require('../models/Producers');

const baseURL= ""
passwordSchema
  .is().min(8)
  .is().max(40)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()

//This CRUD , based on consumer profil, do...
//check the user connected: req.user --> cf isAuthenticated passed in routes (index.js) + defined in check-routes.js

//basically...
// create as admin                 --->POST    .../admin/consumers'                                     ---> last test postman:[23/06][elo]: ok, cf collection : 1 route
// read as consumer / as admin     --->GET     .../myprofile     .../admin/consumers/:consumer_id?      ---> last test postman:[23/06][elo]: ok, cf collection : the 4 routes
// update as consumer / as admin   --->PUT     .../myprofile     .../admin/users/:consumer_id?          ---> last test postman:[23/06][elo]: ok, cf collection : the 2 routes
// delete as consumer / as admin   --->DELETE  .../my profile    .../admin/users/:consumer_id?          ---> last test postman:[23/06][elo]: ok, cf collection : the 2 routes

//specifically...
// favorite producer: addOne, readAll and deleteOne                                                     ---> last test postman:[29/06][elo]: ok, cf collection : 3 routes
// favorite product: addOne, readAll and deleteOne                                                      ---> last test postman:[29/06][elo]: ok, cf collection : 3 routes

// routes protected as admin logged     ---> all access      ---> last test postman:[23/06][elo]: ok all routes tested
// routes protected as cons logged      ---> limit access     --->  last test postman:[23/06][elo]: ok all routes tested
// routes protected as visitor logged   ---> 0 access      ---> last test postman:[23/06][elo]: ok all routes tested


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
    check('confirm_password').notEmpty().withMessage('Password confirmation must not be empty'),
    check('confirm_password').isLength({ min: 6 }).withMessage('Password confirm length must be more than 6 characters too !'),
    ]
// =====================================  c r e a t e     as admin =====================================

// ---------------------------- as admin -----------------------

/**
 * @swagger
 * /consumers/addOneAsAdmin:
 *   post:
 *     tags:
 *       - consumers
 *     description: used to create a consumer as admin
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: the consumer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: the consumer email
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: the consumer password
 *         type: String
 *       - name: confirm_password
 *         in: requestBody
 *         description: the consumer confirm_password
 *         type: String
 *       - name: zip_code
 *         in: requestBody
 *         description: the consumer zip_code
 *         type: Number
 *       - name: is_admin
 *         in: requestBody
 *         description: the consumer is admin ?
 *         type: Boolean
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post(baseURL+'/addOneAsAdmin', CheckFormat,  async function (req, res) {
    console.log("/addOneAsAdmin'", req.user)
    //if admin
    // if (req.user.is_admin == true ){
        console.log("-------------------- c r e a t e     a     c o n s u m e r     p r o f i l e     a s     a d m i n -------------------- [server][CRUD_consumers]");
        console.log(" * request type: ", req.is())
        console.log(" * request body login to add : ",req.body.login)

        // Express validator errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const infos = errors.errors;
            return res.status(400).json({ message: infos[0].msg });
        }

        // checkPassword();
        // Check password strength
        if (!passwordSchema.validate(req.body.password)) {
            const message = " * Le mot de passe n'est pas assez fort (maj + min + chiffre / min 6 caracteres)";
            return res.status(400).json({ message });
        }
        // Check password confirmation match
        if (req.body.password !== req.body.confirm_password) {
            const message = " * Les mots de passe ne correspondent pas";
            return res.status(400).json({ message });
        }

        // Make the new Consumer before insert into DB
        const newConsumer = new Consumers({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
            zip_code:req.body.zip_code,
            is_admin: req.body.is_admin,
        });

        // Check if login already exists in DB
        let isLoginExist = true;
        try {
            isLoginExist = await Consumers.exists({ login: newConsumer.login })
            if (isLoginExist === true) {
                const message = " * Ce login existe déjà";
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
            isEmailExist = await Consumers.exists({ email: newConsumer.email });
            if (isEmailExist === true) {
                const message = " * Cet email existe déjà";
                return res.status(400).json(message);
            }
        } catch (error) {
            console.log(" * ERR! (Check if email already exists in DB):", error);
            const message = " * Check if email already exists in DB: Internal Server Error";
            return res.status(500).json({ message });
        }

        // Save new consumer
        let consumer = null;
        try {
            consumer = await newConsumer.save()
            return res.status(201).json({consumer});
        } catch (error) {
            const message = " * Save a new consumer : Internal Server Error";
            console.log(message, error);
            return res.status(500).json({ message });
        }
    
})


// =====================================   r e a d   as consumer / as admin =====================================

// ---------------------------- as admin -----------------------

/**
 * @swagger
 * /consumers/getAsAdmin/{consumer_id}:
 *   get:
 *     tags:
 *       - consumers
 *     description: used to read a consumer as admin
 *     parameters:
 *       - name: consumer_id
 *         in: path
 *         description: the consumer id
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.get(baseURL+'/getAsAdmin/:consumer_id?', function (req, res) {
    //if admin
    if (req.user.is_admin == true ){
        const consumer_id=req.params.consumer_id;
        console.log("-------------------- g e t     a     c o n s u m e r     p r o f i l e      a s     a d m i n -------------------- [server][CRUD_consumers]");
        if (!consumer_id){
            Consumers.find().sort({login: 'asc'}).exec(function (err, consumers) {
                if (err) {
                    const message = "Internal Server Error"
                    console.log("==> ERROR ! ",err )
                    return res.status(500).json({message});
                }
                return res.status(200).json({ consumers });
            });
        }
        if(consumer_id){
            console.log("consumer_id",consumer_id, )
            Consumers.findOne({_id:consumer_id}, function (err, consumer) {
                if (err) {
                    const message = "Internal Server Error"
                    console.log("==> ERROR ! "+message ,"error:", err)
                    return res.status(500).json({message});
                }
                return res.status(200).json({ consumer });
            });
        }
    }else{
        const message = "You're not logged as admin, this route is forbidden"
        return res.status(400).json({message});
    }
});

// ---------------------------- as consumer -----------------------

/**
 * @swagger
 * /consumers/myprofile:
 *   get:
 *     tags:
 *       - consumers
 *     description: used to read current consumer infos who is logged
 *     responses:
 *       '200':
 *         description: Successful response
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal server error
 */

router.get(baseURL+'/myprofile',  function (req, res) {
    //if consumer connected
    if (req.user.type == 'consumer') {
        console.log("-------------------- g e t     m y     c o n s u m e r     p r o f i l e  -------------------- [server][CRUD_consumers]");
    //if consumer connected
        //data of consumer's profil connected
        Consumers.findOne({_id:req.user._id}, function (err, myprofile) {
                    if (err) {
                        const message = "Internal Server Error"
                        console.log("==> ERROR ! "+message ,"error:", err )
                        return res.status(500).json({message});
                    }
                    return res.status(200).json({ myprofile });
                });
    }else{
        const message = "You can't access to this profile if is not yours";
        return res.status(403).json({ message });
    }

});



// =====================================   u p d a t e    as  consumer   /   as admin  =====================================

// ---------------------------- as consumer -----------------------

/**
 * @swagger
 * /consumers/myprofile/update:
 *   post:
 *     tags:
 *       - consumers
 *     description: used to update his consumer profile
 *     parameters:
 *       - name: login
 *         in: requestBody
 *         description: the consumer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: the consumer email
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: the consumer password
 *         type: String
 *       - name: confirm_password
 *         in: requestBody
 *         description: the consumer confirm_password
 *         type: String
 *       - name: zip_code
 *         in: requestBody
 *         description: the consumer zip_code
 *         type: Number
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal server error
 */

router.post(baseURL+'/myprofile/update', async function (req, res) {

    //if consumer connected
    if (req.user.type == 'consumer') {
        console.log("-------------------- u p d a t e     m y     c o n s u m e r     p r o f i l e  --------------------[server][CRUD_consumers]");
        console.log("req body : ", req.body, "from : ", req.user.login, "/ id# ", req.user._id);
        // Express validator errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const infos = errors.errors;
            console.log(" * error validator:", infos[0].msg)
            return res.status(400).json({ message: infos[0].msg });
        }
            // Check password strength
            if ((req.body.password) && (!passwordSchema.validate(req.body.password)) ) {
                console.log("test password quality");
                const message = "* Le mot de passe n'est pas assez fort (maj + min + chiffre / min 6 caracteres)";
                return res.status(400).json({ message });
            }

            //check password == confirm_password
            if ((req.body.password) && (req.body.password !== req.body.confirm_password) ) {
                const message = "Les mots de passe ne correspondent pas ";
                return res.status(400).json({ message });
            }

            //put new data
            const updateConsumer = new Consumers({
                login: req.body.login,
                email: req.body.email,
                zip_code: req.body.zip_code,
                password: req.body.password,
        });


            //everything checked -> update consumer data in db only with input not empty
            Consumers.findById(req.user._id, async function(err,consumer){
                console.log(" * Consumers.findById()... ")
                if(err){
                    console.log(" *consumers.findById err: ",err)
                    return res.status(500).json({ err });
                }
                if(req.body.login){
                    if (/^.{5,}$/.test(req.body.login)){
                        consumer.login = req.body.login;
                    }else{
                        const message=" * Le login doit comporter au moins 5 caractères *"
                        return res.status(400).json({message});
                    }
                    // Is login allready exist in db?
                    let isLoginExist = true;
                    try {
                        isLoginExist = await Consumers.exists({ login: updateConsumer.login })
                        if (isLoginExist === true) {
                            const message = "Ce login existe déjà";
                            return res.status(400).json({ message });
                        }
                    } catch (error) {
                        console.log(error);
                        const message = "Internal Server Error";
                        return res.status(500).json({ message });
                    }

                }
                if(req.body.password){
                    consumer.password = req.body.password;
                }
                if(req.body.zip_code){
                    if (/^.[0-9]{4}$/.test(req.body.zip_code)){
                        consumer.zip_code = req.body.zip_code;
                    }else{
                        const message=" * un zipcode doit contenir 5 chiffres *"
                        return res.status(400).json({message});
                    }
                }
                if(req.body.email){
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
                        consumer.email = req.body.email;
                    }else{
                        const message="Cet email n'est pas valide"
                        return res.status(400).json({message});
                    }
                    // Is email allready exist in db?
                    let isEmailExist = true;
                    try {
                        isEmailExist = await Consumers.exists({ email: updateConsumer.email });
                        if (isEmailExist === true) {
                            return res.status(400).json("Cet email existe déjà");
                        }
                    } catch (error) {
                        const message = "Internal Server Error";
                        return res.status(500).json({ message });
                    }
                }
                consumer.save();
                const message = " Profil mis à jour avec succès";
                console.log(" * ",message)
                return res.status(200).json({ message });
            });

        }else{
            const message = " * You can't update this profile if it is not yours";
            console.log( message)
            return res.status(403).json({ message });
        }
    });


    // ---------------------------- as admin -----------------------

/**
 * @swagger
 * /consumers/UpdateOneAsAdmin/{consumer_id}:
 *   post:
 *     tags:
 *       - consumers
 *     description: used to update a consumer as admin
 *     parameters:
 *       - name: consumer_id
 *         in: path
 *         description: the consumer ID
 *         type: Object ID
 *       - name: login
 *         in: requestBody
 *         description: the consumer login
 *         type: String
 *       - name: email
 *         in: requestBody
 *         description: the consumer email
 *         type: String
 *       - name: password
 *         in: requestBody
 *         description: the consumer password
 *         type: String
 *       - name: confirm_password
 *         in: requestBody
 *         description: the consumer confirm_password
 *         type: String
 *       - name: zip_code
 *         in: requestBody
 *         description: the consumer zip_code
 *         type: Number
 *       - name: is_admin
 *         in: requestBody
 *         description: the consumer is admin ?
 *         type: Boolean
 *       - name: my_producers
 *         in: requestBody
 *         description: the consumer followed producers
 *         type: Array
 *       - name: my_categories
 *         in: requestBody
 *         description: the consumer followed products
 *         type: Array
 *       - name: blocked_by
 *         in: requestBody
 *         description: the consumer is blocked by a producer ?
 *         type: Array
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal server error
 */

    router.post(baseURL+'/UpdateOneAsAdmin/:consumer_id?', async function (req, res) {

        const id = req.params.consumer_id

        // if (req.user.is_admin == true)
        if (req.user.is_admin == true ){
            console.log("-------------------- u p d a t e     a     c o n s u m e r     p r o f i l e      a s    a d m i n --------------------[server][CRUD_consumers]");
            console.log(" * id to update: ",id )

             // Check password strength & confirmation
            if ( (req.body.password) && (!passwordSchema.validate(req.body.password)) ){
                console.log("Password is not strong enough");
                const message = "Password is not strong enough";
                return res.status(400).json({ message });
            }
            if ((req.body.password) && (req.body.password !== req.body.confirm_password)) {
                const message = "Passwords do not match";
                return res.status(400).json({ message });
            }

            //put new data
            console.log(" new data: ",req.body )
            const updateConsumer = new Consumers({
                login: req.body.login,
                email: req.body.email,
                zip_code: req.body.zip_code,
                password: req.body.password,
                is_admin: req.body.is_admin,
                my_producers : req.body.my_producers,
                my_categories : req.body.my_categories,
                blocked_by: req.body.blocked_by,
            });

            // Check if "new" login already exists in DB
            if(req.body.login){
                const isLoginExist = await Consumers.exists({ login: updateConsumer.login })
                    .then((isLogin) => {
                        return isLogin;
                    })
                    .catch((error) => {
                        console.log(" * ERR! Check if login already exists in DB: ", error)
                        return error;
                    })
                if (isLoginExist === true) {
                    const message = "This login already exists";
                    return res.status(400).json({ message });
                } else if (isLoginExist !== false) {
                    const message = "Internal Server Error"
                    return res.status(500).json({message});
                }
            }

            // Check if "new" email already exists in DB
            if(req.body.email){
                const isEmailExist = await Consumers.exists({ email: updateConsumer.email })
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

            //all data in input are checked, search profile to update ...
            Consumers.findById(req.params.consumer_id,function(err,consumer){
                if(req.body.login){
                    console.log("change login"),
                    consumer.login = req.body.login;
                }
                if(req.body.password){
                    console.log("change password"),
                    consumer.password = req.body.password;
                }
                if(req.body.email){
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
                        console.log("change email"),
                        consumer.email = req.body.email;
                    }else{
                        const message="email is not valid"
                        return res.status(400).json({message});
                    }
                }
                if(req.body.admin){
                    consumer.admin = req.body.admin;
                }
                if(req.body.zip_code){
                    consumer.zip_code = req.body.zip_code;
                }
                if(req.body.my_producers){
                    consumer.my_producers = req.body.my_producers;
                }
                if(req.body.my_categories){
                    consumer.my_categories = req.body.my_categories;
                }
                if(req.body.blocked_by){
                    consumer.blocked_by = req.body.blocked_by;
                }
                if(err){
                    console.log("error updating consumer: ",err)
                }

                consumer.save();
                const message = "Consumer profile updated"
                return res.status(201).json({ message, consumer });
            });

        }else{
            const message = "You can't update this profile if you are not admin";
            return res.status(403).json({ message });
        }
    });





// ----------------------------------------------   d e l e t e    --------------------------------------------------

  // ---------------------------- as consumer -----------------------

/**
 * @swagger
 * /consumers/myprofile/delete:
 *   delete:
 *     tags:
 *       - consumers
 *     description: used to delete his profile consumer
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal server error
 */

router.delete(baseURL+'/myprofile/delete',  function (req, res) {
    //if consumer connected
    if (req.user.type == 'consumer') {
        //delete one
        console.log("-------------------- d e l e t e      m y     p r o f i l e    --------------------[server][CRUD_consumers]");
        Consumers.findOneAndDelete({ _id:req.user._id}, function (err, consumerToDelete) {
            if (err) {
                const message = "Internal Server Error"
                return res.status(500).json({message});
            }
            // Check consume existence
            if (!consumerToDelete) {
                const message = "Consumers not found";
                return res.status(400).json({ message });
            } else{
                const message = "Consumer deleted: ";
                return res.status(200).json({ message, consumerToDelete });
            }
        });
    }else{
    const message = "You can't delete this profile if it is not yours";
    return res.status(403).json({ message });
    }
});

  // ---------------------------- as admin -----------------------

/**
 * @swagger
 * /consumers/deleteOneAsAdmin/{consumer_id}:
 *   delete:
 *     tags:
 *       - consumers
 *     description: used to delete a consumer as admin
 *     parameters:
 *       - name: consumer_id
 *         in: path
 *         description: the consumer ID
 *         type: Object ID
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal server error
 */

router.delete(baseURL+'/deleteOneAsAdmin/:consumer_id?',  function (req, res) {

    //if admin
    if (req.user.is_admin == true){
        console.log("-------------------- d e l e t e     a     c o n s u m e r     p r o f i l e      a s    a d m i n --------------------[server][CRUD_consumers]");
        const id = req.params.consumer_id

        //delete one
        Consumers.findOneAndDelete({ _id: id }, function (err, consumer) {
            if (err) {
                const message = "Internal Server Error"
                return res.status(500).json({message});
            }
            // Check consumer existence
            if (!consumer) {
                const message = "Consumer not found";
                return res.status(400).json({ message });
            } else {
                const message = "Consumer deleted";
                return res.status(201).json({ message, consumer });
            }
        });
    }else{
        const message = "You're not logged as admin, this route is forbidden"
        return res.status(403).json({message});
}
});

// =====================================   f a v o r i t e s   p r o d u c e r s =====================================



// ---------------------------- read my favorites producers -----------------------

/**
 * @swagger
 * /consumers/myFavoritesProducers:
 *   get:
 *     tags:
 *       - consumers
 *     description: used to read my favorites producers
 *     responses:
 *       '200':
 *         description: Successful request
 *       '500':
 *         description: Internal server error
 */

router.get(baseURL+'/myFavoritesProducers', function (req, res) {
    console.log("-------------------- g e t     m y     f a v o r i t e s    p r o d u c e r    -------------------- [server][CRUD_producers]");
    console.log(" * /myFavoritesProducers requested by: ",req.user.login)
    Consumers.find({_id:req.user._id})
    .populate('my_producers')
    .exec((err,producers)=>{
        if (err){
            console.log(" * /myFavoritesProducers error :  ",err)
            return res.status(500).json({err});
        }
        console.log(" *my favorites producers:", producers[0].my_producers)
        return res.status(200).json(producers[0].my_producers);
    })
});


// ---------------------------- add a favorite producer -----------------------

/**
 * @swagger
 * /consumers/addAfavoriteProducer/{producer_id}:
 *   post:
 *     tags:
 *       - consumers
 *     description: used to add a favorite producer
 *     parameters:
 *       - name: producer_id
 *         in: path
 *         description: the producer ID
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful request
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.post(baseURL+"/addAfavoriteProducer/:producer_id?", function (req, res) {
    console.log("-------------------- a d d     a     n e w     p r o d u c e r     i n      m y      f a v o r i t e s     --------------------[server][CRUD_consumers]");
    const producer_id = req.params.producer_id;
    const me = req.user._id;
    console.log("req.user._id: ",req.user._id, " req.params.producer_id : ", req.params.producer_id )
    Consumers.find( {_id : me , my_producers:producer_id}, function(err,allready){
        if(allready.length > 0){
            console.log(" * allready ->", allready);
            const message = "Vous êtes déjà abonné(e) à ce producteur.";
            console.log( "* message:  ",message);
            return res.status(200).json({ message });
        }
        if(err){
            console.log(" * message : ", err);
            return res.status(500).json({ message });
        }
        if(allready.length == 0){
             Consumers.findById(me, function(err,consumer){
                 if(err){
                    console.log(" * message : ", err);
                    return res.status(500).json({ message });
                 }
                 if(consumer){
                    consumer.my_producers.push(producer_id);
                    Producers.findById(producer_id, function(err,producer){
                        console.log("SALUT");
                        if(err){
                            console.log(" * message : ", err);
                            return res.status(500).json({ message });
                        }
                        if(producer){
                            console.log("SAAAAALLLLLLLLUUUUUUUUUUTTTTTTTT");
                            producer.followers.push(me);
                            producer.save(function(err){
                                if (err){
                                    console.log(" * error saving new favorite producer: ",err)
                                }
                            });
                        }
                    })
                    consumer.save(function(err){
                         if (err){
                             console.log(" * error saving new favorite producer: ",err)
                         }
                     });
                    const message = "New favorite producer added !"
                    return res.status(201).json({ message, consumer });
                 }else{
                    const message = "You seems not logged !";
                    console.log( "* message:  ",message);
                    return res.status(400).json({ message });
                 }
            })
        }
    })
})

// ---------------------------- delete a favorite producer -----------------------

/**
 * @swagger
 * /consumers/RemoveAfavoriteProducer/{producer_id}:
 *   post:
 *     tags:
 *       - consumers
 *     description: used to delete a favorite producer
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

router.post(baseURL+"/RemoveAfavoriteProducer/:producer_id?", function (req, res) {
    console.log("-------------------- r e m o v e     a    p r o d u c e r     f r o m     m y      f a v o r i t e s     --------------------[server][CRUD_consumers]");
    const producer_id = req.params.producer_id;
    console.log( "producer_id to remove : ",producer_id)
    const me = req.user._id;
    Consumers.updateOne({_id : me},{$pull:{ my_producers:producer_id}},function(err,consumer){
        if(err){
            console.log(" * message : ", err);
            return res.status(500).json({ message });
        }
        if(consumer){
            message = ( " * consumer's favorites producers is updated,  (" + producer_id + " removed from the list)")
            console.log( message);
            Producers.updateOne({_id: producer_id},{$pull:{ followers: me }}, function(err,producer){
                if(producer){
                    return res.status(200).json({ message });
                }
            })
        }else{
            message= ( " * no consumer profile found with this id: " + me);
            console.log( message );
            return res.status(400).json( {message} );
        }
    })
});

// =====================================   f a v o r i t e s   p r o d u c t s =====================================



// ---------------------------- read my favorites product -----------------------

/**
 * @swagger
 * /consumers/myFavoritesProducts:
 *   get:
 *     tags:
 *       - consumers
 *     description: used to read my favorites products
 *     responses:
 *       '200':
 *         description: Successful request
 *       '500':
 *         description: Internal server error
 */

router.get(baseURL+'/myFavoritesProducts', function (req, res) {
    console.log("-------------------- g e t     m y     f a v o r i t e s    p r o d u c t s   -------------------- [server][CRUD_producers]");
    console.log(" * /myFavoritesProducts requested by: ",req.user.login)
    Consumers.find({_id:req.user._id})
    .populate('my_categories')
    .exec((err,product)=>{
        if (err){
            console.log(" * /myFavoritesProducts error :  ",err)
            return res.status(500).json({err});
        }
        console.log(" *my favorites products:", product[0].my_categories)
        return res.status(200).json(product[0].my_categories);
    })
});


// ---------------------------- add a favorite product -----------------------

/**
 * @swagger
 * /consumers/addAfavoriteProduct/{product_id}:
 *   post:
 *     tags:
 *       - consumers
 *     description: used to add a favorite product
 *     parameters:
 *       - name: product_id
 *         in: path
 *         description: the product ID
 *         type: Object ID
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.post(baseURL+"/addAfavoriteProduct/:product_id?", function (req, res) {
    console.log("-------------------- a d d     a     n e w     p r o d u c t     i n      m y      f a v o r i t e s     --------------------[server][CRUD_consumers]");
    const product_id = req.params.product_id;
    const me = req.user._id;
    console.log("req.user._id: ",req.user._id, " req.params.product_id : ", req.params.product_id )
    Consumers.find( {_id : me , my_categories:product_id}, function(err,allready){
        if(allready.length > 0){
            console.log(" * allready ->", allready);
            const message = "product allready in favorites !!";
            console.log( "* message:  ",message);
            return res.status(400).json({ message });
        }
        if(err){
            console.log(" * message : ", err);
            return res.status(500).json({ message });
        }
        if(allready.length == 0){
             Consumers.findById(me, function(err,consumer){
                 if(err){
                    console.log(" * message : ", err);
                    return res.status(500).json({ message });
                 }
                 if(consumer){
                    consumer.my_categories.push(product_id);
                    consumer.save(function(err){
                         if (err){
                             console.log(" * error saving new favorite product: ",err)
                         }
                     });
                    const message = "New favorite product added !"
                    return res.status(201).json({ message,consumer });
                 }else{
                    const message = "You seems not logged !";
                    console.log( "* message:  ",message);
                    return res.status(400).json({ message });
                 }
            })
        }
    })
})

// ---------------------------- delete a favorite product -----------------------

/**
 * @swagger
 * /consumers/RemoveAfavoriteProduct/{product_id}:
 *   post:
 *     tags:
 *       - consumers
 *     description: used to delete a favorite product
 *     parameters:
 *       - name: product_id
 *         in: path
 *         description: the product ID
 *         type: Object ID
 *     responses:
 *       '200':
 *         description: Successful request
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.post(baseURL+"/RemoveAfavoriteProduct/:product_id?", function (req, res) {
    console.log("-------------------- r e m o v e     a    p r o d u c t     f r o m     m y      f a v o r i t e s     --------------------[server][CRUD_consumers]");
    const product_id = req.params.product_id;
    console.log( "product_id to remove : ",product_id)
    const me = req.user._id;
    Consumers.updateOne({_id : me},{$pull:{ my_categories:product_id}},function(err,consumer){
        if(err){
            console.log(" * message : ", err);
            return res.status(500).json({ message });
        }
        if(consumer){
            message = ( " * consumer's favorites products is updated,  (" + product_id + " removed from the list)")
            console.log( message);
            return res.status(200).json({ message });
        }else{
            message= ( " * no consumer profile found with this id: " + me);
            console.log( message );
            return res.status(400).json( {message} );
        }
    })
});



module.exports = router;
