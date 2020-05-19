'use strict';

const { Router } = require('express');
const googleRouter = Router();

const passport = require('passport');

const routeGuard = require('./../middleware/route-guard');

//GOOGLE SIGN IN

googleRouter.get(
  '/google',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

googleRouter.get(
  '/google-callback',
  passport.authenticate('google', {
    successRedirect: '/user/private',
    failureRedirect: '/error'
  })
);

googleRouter.get('/join-us', (req, res, next) => {
  //console.log(req.user);
  res.render('join-us');
});

googleRouter.post(
  '/join-us',
  passport.authenticate('join-us', {
    successRedirect: '/',
    failureRedirect: '/join-us'
  })
);

googleRouter.get('/join-us', (req, res, next) => {
  res.render('/join-us');
});

googleRouter.post(
  '/join-us',
  passport.authenticate('join-us', {
    successRedirect: '/user/private',
    failureRedirect: '/join-us'
  })
);

googleRouter.get('/user/private', routeGuard, (req, res, next) => {
  res.render('/private');
});

googleRouter.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = googleRouter;
