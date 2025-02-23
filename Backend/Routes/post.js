const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const POST = require('../models/post');
const requireLogin = require('../middlewares/require')



//route for geting post data from database
router.get("/allposts", requireLogin, (req, res) => {
  let limit = req.query.limit;
  let skip = req.query.skip;
    
  POST.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

router.post("/createPost",requireLogin, (req, res) => {
    const { body, pic } = req.body;

    if (!pic || !body) {
        return res .status(422).json({error:"Please add all the field"})
    }
    const post = new POST({
        
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result) => {
        return res.json({ post: result })
    }).catch(err => console.log(err))

})
router.get("/myposts",requireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id }).populate("postedBy","_id name").then(myposts => { res.json(myposts) }).catch((err) => {
        res.json({error:"sorry try to again fetching all post"})
    })
})

router.put("/like", requireLogin, (req, res) => {
    const { postId } = req.body;
    const { _id } = req.user;
  POST.findByIdAndUpdate(
    postId,
    {
      $push: { likes: _id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .then((result, err) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        console.log(result);
        res.json(result);
      }
    });
});
//unlike
router.put("/unlike", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name")
      .then((result, err) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          return res.json(result);
        }
      });
});

//comment
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    comment: req.body.text,
    postedBy: req.user._id,
  };
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name Photo")
    .then((result,err) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

//Api to delete post
router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  console.log(req.params.postId)
  POST.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .then((post) => {
      console.log(post)
      if (!post) {
        return res.status(422).json({ error: "Post not found" });
      }

      // Check if the user is the author of the post
      if (post.postedBy._id.toString() == req.user._id.toString()) {
        
        post
          .deleteOne()
          .then(() => {
            console.log("deleted");
            return res.json({ message: "Successfully deleted" });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({
                error: "Something went wrong, unable to delete the post",
              });
          });
      } else {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this post" });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "An error occurred while finding the post" });
    });
});

// to show following post
router.get("/myfollowingpost", requireLogin, (req, res) => {
    POST.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => { console.log(err) })
})

module.exports = router;