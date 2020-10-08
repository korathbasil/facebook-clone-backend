const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  variant: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  miniAuthorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  caption: {
    type: String,
  },
  album: {
    albumId: {
      type: mongoose.Types.ObjectId,
    },
    albumName: {
      type: String,
    },
  },
  images: [
    {
      type: mongoose.Types.ObjectId,
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
