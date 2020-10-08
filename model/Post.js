const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  variant: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  miniAuthorId: {
    type: mongoose.Types.ObjectId,
    ref: "MiniUser",
    required: true,
  },
  caption: {
    type: String,
  },
  album: {
    type: mongoose.Types.ObjectId,
    ref: "Album",
  },
  images: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Photo",
    },
  ],
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
        ref: "User",
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
        ref: "Comment",
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

module.exports = mongoose.model("Post", postSchema);
