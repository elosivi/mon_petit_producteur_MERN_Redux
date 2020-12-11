// Packages
const express = require('express');
const router = express.Router();
const uniq = require('uniq');
// const arrayUniq = require('array-uniq');

// Model files
const Producers = require('../models/Producers');
const Products = require('../models/Products');

/**
 * @swagger
 * /search/producers:
 *   post:
 *     tags:
 *       - search
 *     description: used to serve products or category search forms
 *     parameters:
 *       - name: product
 *         in: requestBody
 *         description: product to look for
 *         type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '500':
 *         description: Internal server error
 */
router.post('/producers', async function(req, res) {
    if (req.body.product) {
        // Display by product
        let producers = [];
        try {
            const products = await Products.find({name: {$regex: diacriticSensitiveRegex(req.body.product), $options: 'i'}})
            if (products.length === 0) {
                const result = [];
                return res.status(200).json(result);
            }
            for (const product of products) {
                const producer = await Producers.find({login: product.author})
                if (producer) {
                    producers.push(...producer);
                }
            }
            const uniqueProducers = filterUniqueProducers(producers);
            return res.json(uniqueProducers)
        } catch (error) {
            return res.status(500).json("Internal Server Error. Please Contact your administrator")
        }
    } else if (req.body.category) {
        // Display by category
        Producers.find({productsCategories: {$regex: diacriticSensitiveRegex(req.body.category), $options: 'i'}})
          .then(result => {
              return res.status(200).json(result)
          })
          .catch(error => {
              return res.status(500).json("Internal Server Error. Please Contact your administrator")
          })
    }
})

/**
 * Returns a string containing regex diacritic characters
 * @example miel is transformed into m[i,í,ï][e,é,ë]l
 * @param {String} string - The string as written by the user
 * @return {String}         A string with diacritic characters regex
 */
function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä]')
       .replace(/e/g, '[e,é,ë]')
       .replace(/i/g, '[i,í,ï]')
       .replace(/o/g, '[o,ó,ö,ò]')
       .replace(/u/g, '[u,ü,ú,ù]');
}

/**
 * Returns an array of unique producers.
 * @param {Object[]} producersWithDuplicates - The array with duplicate producers.
 * @return {Object[]}                          The array without duplicate
 */
function filterUniqueProducers(producersWithDuplicates) {
    let tempArray = [];
    let uniqueProducers = [];

    producersWithDuplicates.map(item => {
        tempArray.push(JSON.stringify(item))
    });

    uniq(tempArray);

    tempArray.map(item => {
        uniqueProducers.push(JSON.parse(item))
    });
    return uniqueProducers;
}

module.exports = router;
