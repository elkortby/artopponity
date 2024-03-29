const express = require("express");
const router = express.Router();
const Artist = require("../../models/Artist");

router.post("/registerArtist" , (req, res) => {

  Artist.findOne({ _id: req.body._id }).then( artist => {
    if (!artist) {
      const newArtist = new Artist({
        _id: req.body._id,
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        dicipline: req.body.dicipline,
        eventType: req.body.eventType,
        progress: req.body.progress,
        isValid: false,
      });
      newArtist.save()
        .then(() => res.json({ success: true }))
        .catch(err => console.log(err));
    } else {
      if (req.body.eventType) artist.eventType = req.body.eventType
      if (req.body.fullName) artist.fullName = req.body.fullName;
      if (req.body.phoneNumber) artist.phoneNumber = req.body.phoneNumber;
      if (req.body.description) artist.description = req.body.description;
      if (req.body.wilaya) artist.wilaya = req.body.wilaya;
      if (req.body.isValid) artist.isValid = req.body.isValid;
      if (req.body.progress) artist.progress = req.body.progress;
      if (req.body.dicipline) artist.dicipline = req.body.dicipline;
      if (req.body.eventType) artist.eventType = req.body.eventType;
      if (req.body.categories) artist.categories = req.body.categories;
      artist
        .save()
          .then(() => res.json("success!!"))
            .catch(err => console.log(err));
    }
  });
})

router.post("/getInfoArtists", (req, res) => {
  Artist.findOne({ _id: req.body._id }).then(artist => {
    res.json({
      vide: 1,
      artist
    });
  });
})

router.post("/getArtistList", (req, res) => {
  Artist.find({ progress: { $gte: 75 } }, {__v: 0})
    .then(artists => { res.status(200).json({ artists }); })
    .catch(err => console.log(err))
})

router.post("/FindArtist", (req, res) => {
  Artist.find({ progress: { $gte: 75 } }, {__v: 0})
    .then(artist => { res.json({ artist }) });
})

router.post("/setProgress", (req, res) => {
  Artist.findOne({ _id: req.body._id }).then(artist => {
    artist.progress = req.body.progress;
    artist.save()
      .then(() => res.json("success!!"))
        .catch(err => console.log(err));
  })
})

router.post("/validateArtist", (req, res) => {
  Artist.findOne({ _id: req.body._id }).then(artist => {
    artist.isValid = true;
    artist
      .save()
        .then(() => res.json("success!!"))
          .catch(err => console.log(err));
  })
})

router.post("/delete", (req, res) => {
  Artist.deleteOne({ _id: req.body._id })
    .then(res.json("success"))
    .catch(err => { console.log(err) });
})

router.post("/getAll", (req, res) => {
  Artist.find({})
    .then(artists => { res.status(200).json({ artists }); })
    .catch(err => console.log(err))
})

module.exports = router;