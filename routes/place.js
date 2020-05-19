'use strict';

const express = require('express');
const Place = require('./../models/place');

//IMG STORAGE UPLOAD
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');
//END IMG

//UPLOAD IMG => CONECTED WITH .ENV
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multerStorageCloudinary({
  cloudinary,
  folder: 'libon-remoters'
});
//END UPLOAD

const uploader = multer({ storage });

const placeRouter = new express.Router();

const routeGuard = require('./../middleware/route-guard');

/* LISTING PLACES */

placeRouter.get('/list', (req, res, next) => {
  Place.find()
    .populate('creator')
    .then((places) => {
      res.render('place/list', { places });
    })
    .catch((error) => {
      next(error);
    });
});

/* ADDING PLACES */

placeRouter.get('/create', routeGuard, (req, res) => {
  res.render('place/create');
});

placeRouter.post('/create', routeGuard, uploader.single('images'), (req, res, next) => {
  const name = req.body.name;
  const images = req.file.url;
  Place.findOne({ name })
    .then((document) => {
      if (!document) {
        return Place.create({
          name: req.body.name,
          images,
          description: req.body.description,
          coordinates: [req.body.longitude, req.body.latitude],
          creator: req.user._id
        });
      } else {
        const error = new Error("There's already a place with that name.");
        return Promise.reject(error);
      }
    })
    .then((place) => {
      //const id = place._id;
      res.redirect('/place/list');
    })
    .catch((error) => {
      next(error);
    });
});

/* PLACES DETAIL */

placeRouter.get('/:placeId', routeGuard, (req, res, next) => {
  const placeId = req.params.placeId;
  Place.findById({
    _id: placeId
  })
    .populate('creator')
    .then((place) => res.render('place/single', { place, API_KEY: process.env.API_KEY }))
    .catch((error) => {
      next(error);
    });
});

/* DELETING PALCES */

placeRouter.post('/:placeId/delete', (req, res, next) => {
  const placeId = req.params.placeId;

  Place.findByIdAndDelete(placeId)
    .then(() => {
      res.redirect('/place/list');
      console.log(`You deleted this Place => ${placeId}`);
    })
    .catch((err) => {
      next(err);
    });
});

/* EDIT PLACES */

placeRouter.get('/:placeId/edit', routeGuard, (req, res, next) => {
  const placeId = req.params.placeId;
  Place.findOne({
    _id: placeId
  })
    .then((place) => {
      if (req.user._id.toString === place.creator.toString) {
        res.render('place/edit', { place });
      } else {
        res.redirect('/place/list');
      }
    })
    .catch((error) => {
      next(error);
    });
});
placeRouter.post('/:placeId/edit', routeGuard, (req, res, next) => {
  const placeId = req.params.placeId;
  Place.findOneAndUpdate(
    {
      _id: placeId,
      creator: req.user._id
    },
    {
      name: req.body.name,
      description: req.body.description,
      creator: req.user._id,
      coordinates: [req.body.longitude, req.body.latitude]
    }
  )
    .then((place) => {
      res.redirect('/place/list');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = placeRouter;
