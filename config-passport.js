'use strict';

// Passport Strategy configuration

const passport = require('passport');
const passportGithub = require('passport-github');
const GithubStrategy = passportGithub.Strategy;

const User = require('./models/user');

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((error) => {
      callback(error);
    });
});

//GITHUB

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_API_CLIENT_ID,
      clientSecret: process.env.GITHUB_API_CLIENT_SECRET,
      callbackURL: 'https://lisbon-remoters.herokuapp.com/git-hub-authentication/github-callback',
      scope: 'user:email'
    },
    (accessToken, refreshToken, profile, callback) => {
      console.log(profile);
      const name = profile.displayName;
      const email = profile.emails.length ? profile.emails[0].value : null;
      const photo = profile._json.avatar_url;
      const githubId = profile.id;

      User.findOne({
        githubId
      })

        .then((user) => {
          //console.log(user)
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              email,
              name,
              photo,
              githubId
            });
          }
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((error) => {
          callback(error);
        });
    }
  )
);
