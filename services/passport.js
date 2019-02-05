const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// for everything that uses mongoose model classes
// we are not going to use require statements
// the reason is
// whenever you use mongoose inside of a testing environment
// sometimes your model files will be required into the project multiple times
//  mongoose will get confused when that happens and it will think
// you're attempting to load in multiple models called users
// and then it will throw an error saying
// "you already loading in something called users before"

const Owner = require('../models/owner.js').Owner;
const Ambassador = require('../models/ambassador.js').Ambassador;

// this sets an identifying token that says you are without a doubt
// the user that logged in
passport.serializeUser( (user, done) => {
  // the 1st param passed to done is always the error object.
  // the id in the 2nd param is not the profile.id
  // this id is the id being assigned by mongo
  // the reason we do this instead of profile id is because
  // when we use other strategies like Twitter or Facebook
  // we can't assume that they will have a google id
  // so we use the one assigned by mongo

  // this sets the user.id as the cookie
  done(null, user.id);
});

// takes the id that we stuffed in the cookie from serialize and turn it back into a user model
passport.deserializeUser( async (id, done) => {
  console.log('deserialize', user);
  const user = await Owner.findById( id );
  done(null, user); //attaches req.user
});

// Tells passport to use a google strategy and what credentials
// and function to run when the strategy is used

// The second parameter is the function that fires every time the user gets redirected
// back to our app after they sign in
passport.use(
new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  const existingOwner = await Owner.findOne({ googleId: profile.id });
  if(existingOwner) {
    // the user passed in both done function will become
    // the same user being passed into passport.serializeUser
    done(null, existingOwner);
  } else {
    const owner = await Owner({ googleId: profile.id }).save(); //new token
    done(null, owner);
  }
})
);

passport.use('ambassador-google',
new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  const existingAmbassador = await Ambassador.findOne({ googleId: profile.id });
  if(existingAmbassador) {
    // the user passed in both done function will become
    // the same user being passed into passport.serializeUser
    done(null, existingAmbassador);
  } else {
    const ambassador = await Ambassador({ googleId: profile.id }).save(); //new token
    done(null, ambassador);
  }
}
));

passport.use('owner-local',
new LocalStrategy(function(username, password, done) {
  // Find the user with the given email
  Owner.findOne({ email: username }, function (err, owner) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log('error logging in', err);
      return done(err);
    }
    // if no user present, auth failed
    if (!owner) {
      console.log('no owner account with that email');
      return done(null, {bad: "email"});
    }
    // if passwords do not match, auth failed
    if (owner.password !== password) {
      console.log('incorrect password');
      return done(null, {bad: "password"});
    }
    // auth has has succeeded
    console.log(username, 'has been authorized')
    return done(null, owner);
  });
})
);

passport.use('ambassador-local',
new LocalStrategy(function(username, password, done) {
  console.log('ambassador local strategy', username, password);
  // Find the user with the given email
  Ambassador.findOne({ email: username }, function (err, ambassador) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log('error logging in', err);
      return done(err);
    }
    // if no user present, auth failed
    if (!ambassador) {
      console.log('no ambassador account with that email');
      return done(null, false);
    }
    // if passwords do not match, auth failed
    if (ambassador.password !== password) {
      console.log('incorrect password');
      return done(null, false);
    }
    // auth has has succeeded
    console.log(username, 'has been authorized');
    return done(null, ambassador);
  });
}));
