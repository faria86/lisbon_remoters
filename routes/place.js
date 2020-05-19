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

const uploader = multer({ storage });

const placeRouter = new express.Router();

const routeGuard = require('./../middleware/route-guard');

placeRouter.get('/list', (req, res, next) => {
  Place.find()
    .then((places) => {
      res.render('place/list', { places });
    })
    .catch((error) => {
      next(error);
    });
});

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
          location: req.body.location,
          coordinates: [],
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

placeRouter.get('/:placeId', routeGuard, (req, res, next) => {
  const placeId = req.params.placeId;
  // findeById
  // then
  res.render('place/list');
  // catch
});

placeRouter.get('/:placeId/edit', (req, res, next) => {
  const placeId = req.params.placeId;

  Place.findOne({
    _id: placeId
    // creator: req.user._id,
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

placeRouter.post('/place:Id/edit', routeGuard, (req, res, next) => {
  const placeId = req.params.Id;

  Place.findOneAndUpdate(
    {
      _id: placeId,
      creator: req.user._id
    },
    {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      creator: req.user._id
    }
  )
    .then((place) => {
      res.redirect(`single/${placeId}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = placeRouter;
