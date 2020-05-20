'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const User = require('./../models/user');

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
  folder: 'libon-remoters-user-img'
});
//END UPLOAD

const uploader = multer({ storage });

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

router.get('/user/private', routeGuard, (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.render('user/private', { user });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/user/private', routeGuard, uploader.single('images'), (req, res, next) => {
  const images = req.file.url;

  User.findByIdAndUpdate(req.user._id, { photo: images })
    .then((user) => {
      res.redirect('/user/private');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
