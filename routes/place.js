"use strict";

const express = require("express");

const Place = require("./../models/place");

const placeRouter = new express.Router();

const routeGuard = require("./../middleware/route-guard");

placeRouter.get("/list", (req, res, next) => {
  Place.find()
    .then((places) => {
      res.render("place/list", { places });
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.get("/create", routeGuard, (req, res) => {
  res.render("place/create");
});

placeRouter.post("/create", routeGuard, (req, res, next) => {
  const name = req.body.name;

  Place.findOne({ name })
    .then((document) => {
      if (!document) {
        return Place.create({
          name: req.body.name,
          description: req.body.description,
          location: req.body.location,
          coordinates: [39.5, 3.75],
          creator: req.user._id,
        });
      } else {
        const error = new Error("There's already a place with that name.");
        return Promise.reject(error);
      }
    })
    .then((place) => {
      const id = place._id;
      res.redirect("/place/list");
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.get("/:placeId", routeGuard, (req, res, next) => {
  const placeId = req.params.placeId;
  // findeById
  // then
  res.render("place/list");
  // catch
});

placeRouter.get("/:placeId/edit", (req, res, next) => {
  const placeId = req.params.placeId;

  Place.findOne({
    _id: placeId,
    // creator: req.user._id,
  })
    .then((place) => {
      if (req.user._id.toString === place.creator.toString) {
        res.render("place/edit", { place });
      } else {
        res.redirect("/place/list");
      }
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.post("/place:Id/edit", routeGuard, (req, res, next) => {
  const placeId = req.params.Id;

  Place.findOneAndUpdate(
    {
      _id: placeId,
      creator: req.user._id,
    },
    {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      creator: req.user._id,
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
