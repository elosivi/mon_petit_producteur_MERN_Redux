const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

mongoose.set('useCreateIndex', true);

const ProducersSchema = new Schema({
//23 entries, including 4 unique: true (login,email,adress and farm name)
    // _id: Schema.Types.ObjectId,
    login: {
        type: String,
        min: 5,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        pattern: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        pattern: [,/^[+]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?)(?:[ -]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?))*(?:[ ]?(?:x|ext)\.?[ ]?\d{1,5})?$/, 'Please fill a phone code (ex: 0601234567 or +33601234567)']
    },
    farmName: {
        type: String,
        required: true,
        unique: true,
    },
    producerPresentation: {
        type: String,
        default:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sapien sapien, ultricies ac fringilla ut, consequat vitae est. In sed odio imperdiet, congue felis vel, maximus enim. Vestibulum vel urna nibh. Vestibulum ante ipsum primis in faucibus at."
    },
    producerPicture: {
        type: String,
        default:"producteurs.jpg"
    },
    farmPresentation: {
        type: String,
        default:"Aenean dapibus congue arcu quis scelerisque. Phasellus lacinia id risus sit amet auctor. Pellentesque mollis tempus erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla facilisi. Nullam malesuada nisl in ex ultrices, at mollis neque efficitur. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris rutrum, turpis non ullamcorper varius, felis elit tincidunt quis."
    },
    farmPicture: {
        type: String,
        default:"fermes.jpg"
    },
    productsPresentation: {
        type: String,
        default:"Fusce dictum commodo metus, non volutpat metus imperdiet sit amet. Suspendisse a justo sit amet ex auctor pharetra. In eget vehicula erat. Nullam eu turpis ullamcorper, ullamcorper arcu sodales, tincidunt eros. Donec volutpat felis vitae ligula dapibus, vel eleifend sem tristique. Curabitur gravida."
    },
    productsPicture: {
        type: String,
        default:"produits.jpg"
    },
    address: {
        type: String,
        required: true,
        unique: true,
    },
    zipCode: {
        type: Number,
        required: true,
        pattern: [/^(?:[0-9]\d|9[0-9])\d{3}$/, 'Please fill a valid zip code (5 numbers)']
    },
    city: {
        type: String,
        required: true,
    },
    toKnow:{
        type:String,
        default:"Contactez-moi !"
    },
    gpsCoordinates: {
        type: Array,
        required: true,
        pattern: [/^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/, 'Please fill a valid gps coordinates']
    },
    pickupPoint:{
        type: Array,
    },
    productsCategories:{
        type: Array,
    },
    inChatEnabled: {
        type: Boolean,
        default: false
    },
    followers:{
        type: Array,
    },
    virtualVisit:{
        type: Array,
    },
    grades:{
        type: Array,
    },
    gradesConsId:
    [{ type: Schema.Types.ObjectId, ref: 'Consumers' }],

    creationDate: {
        type: Date
    },
    type: {
        type: String, //consumer/producer
        default : "producer",
    },
    status:{
        type: String,
        enum: ['waiting', 'accepted', 'refused'],
        matches: {
            options: [/\b(?:waiting|accepted|refused)\b/],
            errorMessage: "Invalid status (waiting, accepted or refused only)"
          },
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
},
    {
    versionKey: false,
    collection: 'Producers'
    });

ProducersSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};


ProducersSchema.pre('save', function (next) {
    const Producers = this;

    // /!** only hash the password if it has been modified (or is new)
    // * 1 generate a salt
    // * 2 hash the password using our new salt
    // * 3 override the cleartext password with the hashed one
    // *!/
    if (!Producers.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(Producers.password, salt, function (err, hash) {
            if (err) return next(err);
            Producers.password = hash;
            next();
        });
    });
});

ProducersSchema.methods.comparePassword = async function(candidatePassword) {
    const result = await bcrypt.compare(candidatePassword, this.password)
    return result;
}

const Producers = module.exports = mongoose.model('Producers', ProducersSchema)
