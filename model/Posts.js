const mongoose = require("mongoose");
const Users = require("./Users");

const postsSchema = mongoose.Schema({
  author: {
    avatar: String,
    displayName: String,
  },
  caption: {
    type: String,
  },
  image: {
    type: String,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  sharesCount: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      displayName: {
        type: String,
        required: true,
      },
    },
  ],
  comments: [
    {
      commentId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      userId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      displayName: {
        type: String,
        required: true,
      },
    },
  ],
  shares: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  ],
});

module.exports = mongoose.model("Posts", postsSchema);
