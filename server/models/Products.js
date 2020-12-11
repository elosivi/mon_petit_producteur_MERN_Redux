const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const ProductSchema = new mongoose.Schema({
        name: {
            type: String,
            min: 3,
            required: true,
        },
        author: {        // Product.author === Producer.login
            type: String,
            required: true,
        },
        author_id: {
            type: String,
            required: false
        },
        description: {
            type: String,
            min: 3,
            max: 255,
            required: false,
        },
        category: {
            type: String,
            required: true,
        },
        conditioning: {
            type: String,
            required: true,
        },
        stock: {
            type: String,
            required: true,
        },
        availability: {
            type: Boolean,
            default: true,
        },
        origin: {
            type: String,
            required: false
        },
        season: {
            type: String,
            required: false
        },
        price : {
            type: Number,
            required: true
        },
        pictureUrl: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false,
        collection: 'Products'
    });


const Products = module.exports = mongoose.model('Products', ProductSchema)
