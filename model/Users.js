const { string } = require("@hapi/joi");
const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  profilePicture: {
    profilePictureUrl: {
      type: String,
      default: "",
    },
    imageId: {
      type: mongoose.Types.ObjectId,
    },
  },
  coverPicture: {
    type: String,
    default: "",
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
      postId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
  feed: [
    {
      postId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
  ],
  recentNinePhotos: [
    {
      photoId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
    },
  ],
  albums: [
    {
      albumId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      albumName: {
        type: String,
        required: true,
      },
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

module.exports = mongoose.model("Users", usersSchema);
