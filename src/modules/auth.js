import passport from'passport';
import User from './../../DB/model/user.model.js';

import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/google/callback",
  passReqToCallback: true,
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = await User.create({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.email,
        // Add other necessary user data here
        confirmEmail: true, // Set confirmEmail to true for new Google users
      });
    } else {
      // If the user already exists, update the confirmEmail to true
      user.confirmEmail = true;
      await user.save();
    }

    // Pass the user data to the next middleware
    return done(null, user);
  } catch (error) {
    // Handle any errors
    console.error(error);
    return done(error);
  }
}));

// Serialize and deserialize user functions remain the same

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});