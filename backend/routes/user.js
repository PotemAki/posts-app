const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const multer = require('multer');

const fs = require('fs');

const checkAuth = require('../middleware/check-auth');

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
    cb(null, 'images/users');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.put('/api/users/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      let imagePath = req.body.imagePath;
      let shouldDelet = false
      let updatedUser

      if (!req.body.onlyPass) {
        if (req.file) {
          const url = req.protocol + '://' + req.get('host');
          imagePath = url + '/images/users/' + req.file.filename;
          shouldDelet = true
          
        } else if (!req.body.imagePath) {
          shouldDelet = true
        } else if (req.body.imagePath === 'assets/pfp.png') {
          shouldDelet = true
        }
        updatedUser = {
          displayName: req.body.displayName,
          imagePath: imagePath,
        }
      }
      if (req.body.onlyPass) {
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const updatedUser = {
              password: hash
            };
            User.updateOne({ _id: req.params.id }, updatedUser)
              .then((result) => {
                if (result.modifiedCount > 0) {
                  res.status(200).json({
                    message: 'Successful'
                  });
                } else {
                  res.status(401).json({ message: 'Not authorized!' });
                }
              })
              .catch((error) => {
                res.status(500).json({
                  message: 'Couldn\'t update user!' + error,
                });
              });
          })
          .catch((error) => {
            res.status(500).json({
              message: 'Couldn\'t hash password!' + error,
            });
          });
      }
      if (req.body.onlyPass) {
        return
      }
      User.updateOne({ _id: req.params.id }, updatedUser)
      .then((result) => {
        if (result.modifiedCount > 0) {
          if (shouldDelet) {
            if (user.imagePath && (user.imagePath !== 'assets/pfp.png')) {
              const filename = user.imagePath.split('/images/')[1];
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
          res.status(200).json({
            message: 'succesful'
          });
        } else {
          res.status(401).json({ message: 'Not authorized!' });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Couldn\'t update user!' + error,
        });
      });
    })
});


router.post('/api/user/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials or there already is an user with this email.'
          })
        })
    })
})

router.get('/api/users', (req, res, next) => {
  User.find()
    .then(backendUsers => {
      res.status(200).json({
        users: backendUsers
      });
    });
})
router.get('/api/users/:id', (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
})


router.post('/api/user/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new Error("Invalid authentication credentials.");
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        throw new Error("Invalid authentication credentials.");
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        displayName: fetchedUser.displayName,
        email: fetchedUser.email,
        imagePath: fetchedUser.imagePath,
        password: fetchedUser.password
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!',
      });
    });
})


router.delete('/api/users/:id', checkAuth, (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'user not found!' });
      }
      return User.deleteOne({ _id: req.params.id, _id: req.userData.userId }).then((result) => {
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Deleted succesfully'})
        } else {
          res.status(401).json({ message: 'not authorized!!'})
        }
      });
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
      res.status(500).json({
        message: 'Could not delete user!',
      });
    });
});




module.exports = router 

