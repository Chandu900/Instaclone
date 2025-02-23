const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const POST = require('../models/post');
const requireLogin = require('../middlewares/require.js')
const USER = require("../models/models.js");


router.get('/user/:id', (req, res) => {
    USER.findOne({ _id: req.params.id }).select('-password')
        .then(user => {
            POST.find({ postedBy: req.params.id })
              .populate("postedBy", "_id")
              .then((posts) => {
                res.status(200).json({ posts,user });
              }).catch(err=>{res.json({error:err})})
        }).catch(err=>{res.json({error:"posts not found"})})
})

//follow
router.put("/follow", requireLogin, (req, res) => {
  // Add the current user to the target user's followers array
  USER.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.user._id } },
    { new: true }
  )
    .then((result) => {
      // Add the target user to the current user's following array
      return USER.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.body.followId } }, // Assuming there is a `following` field
        { new: true }
      );
    })
    .then((result) => {
      // Send back the updated result after both updates
      res.json(result);
    })
    .catch((err) => {
      // Handle errors for both update operations
      return res.status(422).json({ error: "Failed to follow", details: err });
    });
});

//unfollow user
router.put("/unfollow", requireLogin, (req, res) => {
  USER.findByIdAndUpdate(
    req.body.followId,
    { $pull: { followers: req.user._id } },
    { new: true }
  )
    .then((result) => {
      // Second update to remove the user from the followers list of the current user
      USER.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.followId } }, // Assuming you have a `following` field
        { new: true }
      )
        .then((result) => {
          res.json(result); // Send updated user data
        })
        .catch((err) => {
          return res
            .status(422)
            .json({
              error: "Failed to remove from following list",
              details: err,
            });
        });
    })
    .catch((err) => {
      return res
        .status(422)
        .json({ error: "Failed to remove from followers list", details: err });
    });
});

//upload

router.put("/uploadProfilePic", requireLogin, (req, res) => {

  USER.findByIdAndUpdate(
    req.user._id,
    {
      $set: { photo: req.body.pic },
    },
    {
      new: true,
    }
  ).then((result) => {
      
      return res.json(result);
    
  }).catch((err) => {
    if (err) {
      return res.status(422).json({ error: er });
    }
  })
});

module.exports= router;