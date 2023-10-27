const mongoose = require ('mongoose');

const commentSchema = mongoose.Schema({
  postId: { type: String, required: true },
  commentCreatorName: { type: String, required: true },
  commentContent: { type: String, required: true },
  commentDate: { type: String, required: true },
  commentEditDate: { type: String, required: false },
  // creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Comment', commentSchema);
