// Packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

//config
const passportSetup = require('./config/passport-config');
const app = express();
const config = require('./config');

//routes
const isAuthenticated = require('./routes/check-routes');
const profileRoutes = require('./routes/profil-routes');
const authRoutes = require('./routes/auth-routes');
const googleRoutes = require('./routes/google-routes');
const consumers_route = require ('./routes/CRUD_consumers')
const producers_routes = require('./routes/CRUD_producers')
const categoriesRoutes = require('./routes/categories-routes');
const productsRoutes = require('./routes/products-routes');
const articlesRoutes = require('./routes/articles-routes');
const pickUpPointRoutes = require('./routes/pickUpPoints-routes');
const searchRoutes = require('./routes/search-routes');
const uploadPictureRoutes = require('./routes/upload-picture-routes');
const generalData = require('./routes/generalData')

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// Extended : https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Mon Petit Producteur API',
            description: 'Mon Petit Producteur API informations',
            contact: {
                name: 'La bande des 4'
            },
            servers: ['http://localhost:4242']
        }
    },
    // 
    apis: ['index.js', './routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

//models
// const Consumers = require('./models/Consumers');

// API ALLOWING ACCESS.
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(session({secret: 'fame',saveUninitialized: true,resave: true}));
// app.use(function(request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// app.set('view engine', 'ejs');

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser({limit: '500kb'}));

//initialize passport
app.use(session({
    name: 'mon petit producteur',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, httpOnly: false},
    maxAge: 20000 // 20 seconds
}));
app.use(passport.initialize());
app.use(passport.session());


// TEST CONNECTION TO DB
const MongoClient = mongodb.MongoClient;
const connectionToMongo = 'mongodb://127.0.0.1:27042';

MongoClient.connect(connectionToMongo,{useNewUrlParser:true}, (error, client) => {
    if(error) {
        return console.log('Connection failed.')
    }
    console.log('Connection successful to MongoDb.')
});

// -------------------------------------------------- PHASE 1 ---------------------------------------------------------- //

// SCHEMA OF MEMBERS COLLECTION
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27042/MonPetitProducteur");

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}

app.use(cors(corsOptions))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/oauth', googleRoutes);
app.use('/auth', authRoutes);
app.use('/general', generalData);
app.use('/public',express.static('public'))

app.use(isAuthenticated); /*** ROUTE PROTECTION DO NOT REMOVE ***/

// Protected routes


app.use('/search', searchRoutes);
app.use('/profile', profileRoutes);
app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/articles', articlesRoutes);
app.use('/pickup', pickUpPointRoutes);
app.use('/consumers', consumers_route);
app.use('/upload', uploadPictureRoutes);

app.use('/', producers_routes);

// Default "Not found" route
app.use(function (req, res, next) {
    res.status(404).json("Not found");
});

// App listen
app.listen(config.app.port, () => console.log(`Example app listening at http://localhost:${config.app.port}`))


