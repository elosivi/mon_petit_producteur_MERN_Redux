const router = require('express').Router();
const formidable = require('formidable');
const FileType = require('file-type');
const readChunk = require('read-chunk');
const path = require("path");

// Models
const Products = require('../models/Products');
const Articles = require('../models/Articles');
const Producers = require('../models/Producers');

const MAX_SIZE_FILE_UPLOAD_KO = 300;

// UPLOAD DIRECTORIES
const PUBLIC_DIR = path.join(__dirname, '..', 'public/');
const ARTICLE_DIR = path.join(PUBLIC_DIR, 'article/');
const FARM_PRESENTATION_DIR = path.join(PUBLIC_DIR, 'farm-presentation/');
const PRODUCER_PRESENTATION_DIR = path.join(PUBLIC_DIR, 'producer-presentation/');
const PRODUCT_DIR = path.join(PUBLIC_DIR, 'product');
const PRODUCTS_PRESENTATION = path.join(PUBLIC_DIR, 'products-presentation/');

// ROUTES

/**
 * @swagger
 * /upload/article:
 *   post:
 *     tags:
 *       - upload
 *     description: used to upload article image
 *     parameters:
 *       - name: id
 *         in: requestBody
 *         description: the mongoDB id to link to
 *         type: Object ID
 *       - name: fileToUpload
 *         in: requestBody
 *         description: the file to upload
 *         type: file
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.post('/article', (req, res, next) => {
    uploadImage(ARTICLE_DIR, 'Articles', req, res, next)
});

/**
 * @swagger
 * /upload/farm-presentation:
 *   post:
 *     tags:
 *       - upload
 *     description: used to upload farm presentation image
 *     parameters:
 *       - name: id
 *         in: requestBody
 *         description: the mongoDB id to link to
 *         type: Object ID
 *       - name: fileToUpload
 *         in: requestBody
 *         description: the file to upload
 *         type: file
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.post('/farm-presentation', (req, res, next) => {
    uploadImage(FARM_PRESENTATION_DIR, 'farmPicture', req, res, next)
});

/**
 * @swagger
 * /upload/producer-presentation:
 *   post:
 *     tags:
 *       - upload
 *     description: used to upload producer presentation image
 *     parameters:
 *       - name: id
 *         in: requestBody
 *         description: the mongoDB id to link to
 *         type: Object ID
 *       - name: fileToUpload
 *         in: requestBody
 *         description: the file to upload
 *         type: file
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.post('/producer-presentation', (req, res, next) => {
    uploadImage(PRODUCER_PRESENTATION_DIR, 'producerPicture', req, res, next)
});

/**
 * @swagger
 * /upload/product:
 *   post:
 *     tags:
 *       - upload
 *     description: used to upload product image
 *     parameters:
 *       - name: id
 *         in: requestBody
 *         description: the mongoDB id to link to
 *         type: Object ID
 *       - name: fileToUpload
 *         in: requestBody
 *         description: the file to upload
 *         type: file
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.post('/product', (req, res, next) => {
    uploadImage(PRODUCT_DIR, 'Products', req, res, next)
});

/**
 * @swagger
 * /upload/products-presentation:
 *   post:
 *     tags:
 *       - upload
 *     description: used to upload products presentation image
 *     parameters:
 *       - name: id
 *         in: requestBody
 *         description: the mongoDB id to link to
 *         type: Object ID
 *       - name: fileToUpload
 *         in: requestBody
 *         description: the file to upload
 *         type: file
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad request
 */
router.post('/products-presentation', (req, res, next) => {
    uploadImage(PRODUCTS_PRESENTATION, 'productsPicture', req, res, next)
});

/**
 * Handling of picture uploaded
 * @param {String} dirname - The directory in which the picture will be uploaded
 * @param {String} collectionName - Case used to determine the mongoDB collection in which the picture will be uploaded
 * @param {Request} req
 * @param {Response} res
 * @param {next}
 */
function uploadImage(dirname, collectionName, req, res, next) {
    const formidableOptions = {
        multiples: false,
        keepExtensions: true,
        uploadDir: dirname,
        maxFileSize: MAX_SIZE_FILE_UPLOAD_KO * 1024
    }
    const form = formidable(formidableOptions);

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log("Image upload error 1")
            return res.status(400).json("Something went wrong with your request");
        }
        if (!fields.id || !files.fileToUpload) {
            console.log("Image upload error 2")
            return res.status(400).json("Something went wrong with your request");
        }
        const buffer = readChunk.sync(files.fileToUpload.path, 0, 4100);
        const fileType = await FileType.fromBuffer(buffer);
        if(!fileType.ext.match(/(jpg|jpeg|png|gif)$/i)) {
            console.log("Upload file type error")
            return res.status(400).json("Upload file type error");  
        }

        let fileName = files.fileToUpload.path.replace(dirname, '');
        fileName = fileName.replace('/', '');

        const mongoField = `{$set: {pictureUrl: fileName}}`

        switch(collectionName) {
            case 'Products':
                Products.updateOne(
                    {_id: fields.id},
                    {$set: {pictureUrl: fileName}},
                    {upsert: true}, 
                    function (err, result) {
                        if (err) {
                            return res.status(400).json("Something went wrong with your request");
                        } else {
                            return res.status(200).json("Image correctly updated");
                        }
                });
            break;
            case 'Articles':
                Articles.updateOne(
                    {_id: fields.id},
                    {$set: {picture: fileName}},
                    {upsert: true}, 
                    function (err, result) {
                        if (err) {
                            return res.status(400).json("Something went wrong with your request");
                        } else {
                            return res.status(200).json("Image correctly updated");
                        }
                });
            break;
            case 'producerPicture':
                Producers.updateOne(
                    {_id: fields.id},
                    {$set: {producerPicture: fileName}},
                    {upsert: true}, 
                    function (err, result) {
                        if (err) {
                            return res.status(400).json("Something went wrong with your request");
                        } else {
                            return res.status(200).json("Image correctly updated");
                        }
                });
            break;
            case 'farmPicture':
                Producers.updateOne(
                    {_id: fields.id},
                    {$set: {farmPicture: fileName}},
                    {upsert: true}, 
                    function (err, result) {
                        if (err) {
                            return res.status(400).json("Something went wrong with your request");
                        } else {
                            return res.status(200).json("Image correctly updated");
                        }
                });
            break;
            case 'productsPicture':
                Producers.updateOne(
                    {_id: fields.id},
                    {$set: {productsPicture: fileName}},
                    {upsert: true}, 
                    function (err, result) {
                        if (err) {
                            return res.status(400).json("Something went wrong with your request");
                        } else {
                            return res.status(200).json("Image correctly updated");
                        }
                });
            break;
            default:
                return res.status(400).json("Something went wrong with your request");
        }
    });
}

module.exports = router;
