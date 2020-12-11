const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const Producers = require('../models/Producers');
const Products = require('../models/Products');

mongoose.set('useCreateIndex', true);

const ConsumersSchema = new Schema({
    login: {
        type: String,
        min: 5,
        required: false,
        unique: true },

    email: {
        type: String,
        required: false,
        unique: true,
        pattern: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: false,
    },
    zip_code: {
        type: Number,
        required: false,
        pattern: [/^(?:[0-9]\d|9[0-9])\d{3}$/, 'Please fill a valid zip code (5 numbers)']
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    my_producers: 
        [{ type: Schema.Types.ObjectId, ref: 'Producers' }],
    my_categories: 
        [{ type: Schema.Types.ObjectId, ref: 'Products' }],
    type: {
        type: String, //consumer/producer
        default : "consumer",
    },
    blocked_by : 
        [{ type: Schema.Types.ObjectId, ref: 'Producers' }],
    },
    {
    versionKey: false,
    collection: 'Consumers'
    });

ConsumersSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};


ConsumersSchema.pre('save', function (next) {
    const Consumers = this;

    // /!** only hash the password if it has been modified (or is new)
    // * 1 generate a salt
    // * 2 hash the password using our new salt
    // * 3 override the cleartext password with the hashed one
    // *!/
    if (!Consumers.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(Consumers.password, salt, function (err, hash) {
            if (err) return next(err);
            Consumers.password = hash;
            next();
        });
    });
});

ConsumersSchema.methods.comparePassword = async function(candidatePassword) {
    const result = await bcrypt.compare(candidatePassword, this.password)
    return result;
}

const Consumers = module.exports = mongoose.model('Consumers', ConsumersSchema)
