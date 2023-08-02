const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId, // ObjectID type
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId, // ObjectID type
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  image: {
    type: [String], // List of image file names
    required: true,
  },
  comment_text: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
