const mongoose = require('mongoose');

const PickUpPointSchema = new mongoose.Schema({
        pick_up_name: {
            type: String,
            required: true
        },
        address : {
            type: String,
            min : 3,
            required: true
        },
        zip_code : {
            type: Number,
            required: true
        },
        city : {
            type: String,
            required: true
        },
        phone : {
            type: String,
            required: true,
            pattern: [/^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/, 'Please fill a valid gps coordinates']
        },
        opening_hours : {
            type: String,
            required: false
        },
        producer_name : {
            type: String,
            required: true
        },
        gpsCoordinates : {
            type: Array,
            required: false
        },
        payment_methods : {
            type: Array,
            required: false
        }},
    {
        versionKey: false,
        collection: 'PickUpPoint'
    });


const PickUpPoint = module.exports = mongoose.model('PickUpPoint', PickUpPointSchema)
