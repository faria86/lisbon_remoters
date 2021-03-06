'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');

const router = new Router();

const routeGuard = require('./../middleware/route-guard');

//SIGN UP

router.get('/join-us', (req, res, next) => {
  res.render('join-us');
});

router.post('/join-us', (req, res, next) => {
  const { name, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        email,
        passwordHash: hash
      });
    })
    .then((user) => {
      req.session.user = user._id;
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

//SING IN

router.get('/join-us', (req, res, next) => {
  res.render('join-us');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then((result) => {
      if (result) {
        req.session.user = user._id;
        res.redirect('/');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

//UPDATE PASSWORD
router.post('/change-password', (req, res, next) => {
  const password = req.body.password;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.findByIdAndUpdate(req.user._id, {
        passwordHash: hash
      });
    })
    .then((user) => {
      res.redirect('/user/private');
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
