const { Storage } = require("@google-cloud/storage");
const path = require("path");

// GCP config
const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    "../facebook-clone-291012-cc3214523360.json"
  ),
  projectId: "facebook-clone-291012",
});
const imageBucket = gc.bucket("fb-clone-images");

module.exports = imageBucket;
