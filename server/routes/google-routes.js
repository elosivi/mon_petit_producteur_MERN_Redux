const router= require('express').Router();
const passport = require('passport');

/**
 * @swagger
 * /oauth/login:
 *   post:
 *     tags:
 *       - google auth
 *     description: used to logged in using google auth
 *     responses:
 *       'req.user':
 *         description: user logged with google
 */


router.post('/login',
    passport.authenticate('google'),
    function (req, res) {
        res.json(req.user);
    }
);

module.exports = router;
