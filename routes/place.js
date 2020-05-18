'use strict';

const express = require('express');

const Place = require('./../models/place');

const placeRouter = new express.Router();

const routeGuard = require('./../middleware/route-guard');

placeRouter.get('/list', (req, res, next) => {
  Place.find()
    .then(places => {
      res.render('place/list', { places });
    })
    .catch(error => {
      next(error);
    });
});

placeRouter.get('/create', routeGuard, (req, res) => {
  res.render('place/create');
});

placeRouter.post('/create', routeGuard, (req, res, next) => {
  const name = req.body.name;

  Place.findOne({ name })
    .then(document => {
      if (!document) {
        return Place.create({
          name
        });
      } else {
        const error = new Error("There's already a place with that name.");
        return Promise.reject(error);
      }
    })
    .then(place => {
      const id = place._id;
      res.redirect('/place/' + id);
    })
    .catch(error => {
      next(error);
    });
});







module.exports = placeRouter;
