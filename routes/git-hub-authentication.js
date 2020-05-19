'use strict';

const { Router } = require('express');
const gitHubRouter = Router();

const passport = require('passport');

const routeGuard = require('./../middleware/route-guard');

//GIT HUB SIGN IN

gitHubRouter.get(
  '/github',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

gitHubRouter.get(
  '/github-callback',
  passport.authenticate('github', {
    successRedirect: '/user/private',
    failureRedirect: '/error'
  })
);

gitHubRouter.get('/join-us', (req, res, next) => {
  //console.log(req.user);
  res.render('join-us');
});

gitHubRouter.post(
  '/join-us',
  passport.authenticate('join-us', {
    successRedirect: '/',
    failureRedirect: '/join-us'
  })
);

gitHubRouter.get('/join-us', (req, res, next) => {
  res.render('join-us');
});

gitHubRouter.post(
  '/join-us',
  passport.authenticate('join-us', {
    successRedirect: '/user/private',
    failureRedirect: '/join-us'
  })
);

gitHubRouter.get('/private', routeGuard, (req, res, next) => {
  res.render('user/private');
});

gitHubRouter.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = gitHubRouter;
