const express = require('express')

const multer = require('multer');

const Comment = require('../models/comment')

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/api/comments');


router.post('/api/comments', checkAuth, (req, res, next) =>{
  
  const comment = new Comment({
    postId: req.body.postId,
    commentCreatorName: req.body.commentCreatorName,
    commentContent: req.body.commentContent,
    commentDate: req.body.commentDate,
  })
  comment.save().then(createdComment => {
    res.status(201).json({
      message: 'comment added with success',
      comment: { 
        id: createdComment._id,
        content: createdComment.content,
      }
  })
  });
})

router.get('/api/comments', (req, res, next) => {
  Comment.find()
    .then(backendComments => {
      res.status(200).json({
        message: 'post fetched with success',
        comments: backendComments
      });
    });
})

router.delete('/api/comments/:id', checkAuth, (req, res, next) => {
  Comment.findById(req.params.id)
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ message: 'comment not found!' });
      }
      console.log(req.userData)
      return Comment.deleteOne({ _id: req.params.id, commentCreatorName: req.userData.userId }).then((result) => {
        if (result.deletedCount > 0) {
          res.status(200).json({
            message: 'Comment Deleted!',
          });
         } else {
          res.status(401).json({ message: 'not authorized!'})
         }
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Could not delete comment!',
      });
    });
});

router.get('/api/comments/:id', (req, res, next) => {
  Comment.findById(req.params.id).then(comment => {
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({message: 'Comment not found!'});
    }
  })
})

router.put('/api/comments/:id', checkAuth, (req, res, next) => {
  Comment.findById(req.params.id)
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found!' });
      }
      const updatedComment = {
        __id: req.body.id,
        postId: req.body.postId,
        commentContent: req.body.commentContent,
        commentCreatorName: req.body.commentCreatorName,
        commentDate: req.body.commentDate,
        commentEditDate: req.body.commentEditDate,
      }
      Comment.updateOne({ _id: req.params.id, commentCreatorName: req.userData.userId }, updatedComment)
        .then((result) => {
          if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Update successful!' });
          } else {
            res.status(401).json({ message: 'Not authorized!' });
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Couldn\'t update comment!' + error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Could not update comment!',
      });
    });
});

module.exports = router;
