const router= require('express').Router();

// Password validator
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();
// Express validator
const { check, validationResult } = require('express-validator');

const Consumer = require('../models/Consumers')

passwordSchema
  .is().min(8)
  .is().max(40)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()

// =========================================== R E G I S T E R ==================================================== //

router.post('/register', [
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
    ], async function (req, res) {

    console.log("===== POST REGISTER =====")
    console.log(req.is())
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
    if (req.body.password !== req.body.confirm_password) {
        const message = "Passwords do not match";
        return res.status(400).json({ message });
    }

    // Make the new Consumer before insert into DB
    const newConsumer = new Consumer({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        zip_code:req.body.zip_code,
        is_admin: false
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
            login: req.session.login,
            admin: req.session.admin
        });
        console.log(status)
    } catch (error) {
        const message = "Internal Server Error";
        return res.status(500).json({ message });        
    }
})

module.exports = router;
