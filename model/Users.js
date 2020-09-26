const { string } = require("@hapi/joi");
const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  profilePicture: {
    type: String,
    default: "",
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
  friends: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      profilePicture: {
        type: String,
        default: "",
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
