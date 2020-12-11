const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        pictogram : {
            type: String,
            required: false
        }},
    {
        versionKey: false,
        collection: 'Categories'
    });


const Categories = module.exports = mongoose.model('Categories', CategoriesSchema)
