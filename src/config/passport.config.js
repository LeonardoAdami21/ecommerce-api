import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import User from "../models/user.model.js";
import { callbackUrl, clientId, clientSecret } from "../env/envoriment.js";
import passport from "passport";

const googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            const newUser = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
            done(null, newUser);
          }
        } catch (error) {
          done(error, false);
        }
      },
    ),
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ facebookId: profile.id });
          if (user) {
            done(null, user);
          } else {
            const newUser = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              facebookId: profile.id,
            });
            await newUser.save();
            done(null, newUser);
          }
        } catch (error) {
          done(error, false);
        }
      },
    ),
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
