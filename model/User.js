const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  miniUserId: {
    type: mongoose.Types.ObjectId,
    ref: "MiniUser",
  },
  profilePicture: {
    profilePictureUrl: {
      type: String,
      default: "",
    },
    imageId: {
      type: mongoose.Types.ObjectId,
      ref: "Photo",
    },
  },
  coverPicture: {
    coverPictureUrl: {
      type: String,
      default: "",
    },
    imageId: {
      type: mongoose.Types.ObjectId,
      ref: "Photo",
    },
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    ZIP: {
      type: String,
    },
  },
  DOB: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  feed: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  recentNinePhotos: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Photo",
    },
  ],
  albums: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Album",
    },
  ],
  friends: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      miniUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
  friendRequestsRecieved: [
    {
      requestId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
  friendRequestsSent: [
    {
      requestId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
