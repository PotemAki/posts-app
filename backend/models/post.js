const mongoose = require ('mongoose');

const postSchema = mongoose.Schema({
  creatorName: { type: String, required: true },
  content: { type: String, required: true },
  postDate: { type: String, required: true },
  editDate: { type: String, required: false },
  imagePath: { type: String, required: false },
  likes: { type: String, required: false },
  likesArray: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorImage: { type: String, required: false },
  group: { type: String, required: false}
})

module.exports = mongoose.model('Post', postSchema);
