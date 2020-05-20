/* COMMENT PLACE */
"use strict";

const express = require("express");
const commentRouter = new express.Router();

const routeGuard = require("./../middleware/route-guard");

//const Place = require('./../models/place');
const Comment = require("./../models/comment");

commentRouter.post("/:placeId", routeGuard, (req, res, next) => {
  const placeId = req.params.placeId;
  const content = req.body.content;

  Comment.create({
    content,
    creator: req.user._id,
    place: placeId
  })
    .then(() => {
      res.redirect(`/place/${placeId}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = commentRouter;
