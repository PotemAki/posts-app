const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require('./routes/posts')
const commetsRoutes = require('./routes/comments')
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://potem:" + process.env.MONGO_ATLAS_PW + "@posts.wv3ww55.mongodb.net/post-app?retryWrites=true&w=majority")
  .then(()=>{
    console.log(`connteted to database`);
  })
  .catch(()=>{
    console.log(`connection failed!`)
  })

app.use(bodyParser.json());
app.use('/images', express.static(path.join('images')));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods", 
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next()
});

app.use(postsRoutes);
app.use(commetsRoutes);
app.use(userRoutes);

module.exports = app;