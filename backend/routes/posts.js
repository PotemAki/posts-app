const express = require('express')

const multer = require('multer');

const fs = require('fs');

const Post = require('../models/post')

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/api/posts');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.post('/api/posts', checkAuth, multer({storage: storage}).single('image'), (req, res, next) =>{
  const url = req.protocol + '://' + req.get('host');
  let imagePath = '';
  if (req.file) {
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    creatorName: req.body.creatorName,
    content: req.body.content,
    postDate: req.body.postDate,
    imagePath: imagePath,
    likes: req.body.likes,
    creator: req.userData.userId,
    creatorImage: req.body.creatorImage,
    likesArray: req.body.likesArray, 
    group: req.body.group
  })
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'post added with success',
      post: { 
        id: createdPost._id,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
  })
  });
})

router.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(backendPosts => {
      res.status(200).json({
        message: 'post fetched with success',
        posts: backendPosts
      });
    });
})

router.delete('/api/posts/:id', checkAuth, (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found!' });
      }
      return Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
        if (result.deletedCount > 0) {
          if (post.imagePath) {
            const filename = post.imagePath.split('/images/')[1];
            const imagePath = 'images/' + filename;
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error('Error deleting image:', err);
              } else {
                console.log('Image deleted:', imagePath);
              }
            });
          }
          res.status(200).json({ message: 'Deleted succesfully'})
        } else {
          res.status(401).json({ message: 'not authorized!!'})
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Could not delete post!',
      });
    });
});

router.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
})

// update post
router.put('/api/posts/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found!' });
      }
      let imagePath = req.body.imagePath;
      let shouldDelet = false
      if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
        shouldDelet = true
        
      } else if (!req.body.imagePath) {
        shouldDelet = true
      }
      const updatedPost = {
        __id: req.body.id,
        content: req.body.content,
        creatorName: req.body.creatorName,
        postDate: req.body.postDate,
        editDate: req.body.editDate,
        imagePath: imagePath,
        likes: req.body.likes,
        likesArray: req.body.likesArray
      }
      if (req.body.likeUpdate) {
        Post.updateOne({ _id: req.params.id }, updatedPost)
        .then((result) => {
          console.log(result);
          if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Likes Update successful!' });
          } else {
            res.status(401).json({ message: 'Likes update Not authorized!' });
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Couldn\'t update likes!' + error,
          });
        });
      }
      if (!req.body.likeUpdate) {
        Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, updatedPost)
        .then((result) => {
          console.log(result);
          if (result.modifiedCount > 0) {
            if (shouldDelet) {
              if (post.imagePath) {
                const filename = post.imagePath.split('/images/')[1];
                const imagePathToDelete = 'images/' + filename;
                fs.unlink(imagePathToDelete, (err) => {
                  if (err) {
                    console.error('Error deleting old image:', err);
                  } else {
                    console.log('Old image deleted:', imagePathToDelete);
                  }
                });
              }
            }
            res.status(200).json({ message: 'Update successful!' });
          } else {
            res.status(401).json({ message: 'Not authorized!' });
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: 'Couldn\'t update post!' + error,
          });
        });
      }
    })
});




module.exports = router;