const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// const keys = require('./keys');
const Consumers = require('../models/Consumers');
const Producers = require('../models/Producers');

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  Producers.findById(id).then((user)=>{

    if(user){
      done(null, user);
    }else{
      Consumers.findById(id).then((user)=>{
          done(null, user);
      });
    }
  })
});

// ========================================= L O C A L       S T R A T E G Y ========================================== // 

const customLocalFields = {
    usernameField: 'login',
    passwordField: 'password'
}


//----------------------------------------   producer strategy   ----------------------------------------
 passport.use("producer", new LocalStrategy(customLocalFields,
  async function(username, password, done) {

    // Check if user exists
    let user = null;
    try {
      user = await Producers.findOne({ login: username });
      if (!user) {
        console.log('+++ Incorrect username. +++')
        return done(null, false, { message: 'Incorrect username.' });
      }
    } catch (error) {
      return done(error);
    }

    // Check if password matches
    let isPasswordMatch = false;
    try {
      isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        console.log('+++ Incorrect password. +++')
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("+++ User connected : ", user);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

const customGoogleFields = {
  usernameField: 'login',
  passwordField: 'password',
  passReqToCallback : true
}


passport.use("google", new LocalStrategy(customGoogleFields,
  async function (req, username, password, done) {
    try {
      // Verification que login existe dans la BDD
      let user = await Consumers.findOne({ email: req.body.email }).exec();
      if (!user) {
        new Consumers({ login: username, email: req.body.email }).save();
        console.log('New consumer created');
        console.log(req.body);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
  
// ----------------------------------------   consumer strategy  ----------------------------------------
passport.use("consumer", new LocalStrategy(customLocalFields,
  async function(username, password, done) {
    console.log(" ------------ passport-config.js ----------")
    // Check if user exists
    let user = null;
    try {
      user = await Consumers.findOne({ login: username });
      if (!user) {
        console.log('+++ Incorrect username. +++')
        return done(null, false, { message: 'Incorrect username.' });
      }
    } catch (error) {
      return done(error);
    }

    // Check if password matches
    let isPasswordMatch = false;
    try {
      isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        console.log('+++ Incorrect password. +++')
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("+++ User connected : ", user.login);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
