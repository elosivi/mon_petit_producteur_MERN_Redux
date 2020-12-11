const mongoose = require('mongoose');

const ArticlesSchema = new mongoose.Schema({
        author: {
            type: String,
            required: true
        },
        author_id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content : {
            type: String,
            min : 3,
            max: 400,
            required: true
        },
        picture : {
            type: Array,
            required: false
        },
        created_at : {
            type: Date,
            default: Date.now
        },
        liked : {
            type: Number,
            required: false
        },
        liked_by : {
            type: Array,
            required: false
        }},
    {
        versionKey: false,
        collection: 'Articles'
    });


const Articles = module.exports = mongoose.model('Articles', ArticlesSchema)
