const router = require('express').Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     tags:
 *       - profile
 *     description: detect authentication
 *     responses:
 *       '200':
 *         description: Successful response
 */

router.get("/", (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: " * OK ! user successfully authenticated :"+req.user.login+" -> "+req.user.type +"/ is admin? "+req.user.isAdmin+"[server][profil-routes.js] ",
        user: req.user,
        cookies: req.cookies
    });
});

module.exports = router;

