const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../util/GCPbucket");
const sharp = require("sharp");

module.exports = async (req, res, next) => {
  const variant = req.body.variant;
  const file = req.files.image;
  const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
  const fileName = new Date().toISOString();
  await streamifier.createReadStream(new Buffer(file.data)).pipe(
    imageBucket
      .file(`${variant}/original/${fileName}.${fileExtension}`)
      .createWriteStream({
        resumable: false,
        gzip: true,
      })
  );
  await sharp(new Buffer(file.data))
    .resize({ width: 320 })
    .toBuffer()
    .then((data) => {
      streamifier.createReadStream(data).pipe(
        imageBucket
          .file(`${variant}/small/${fileName}.${fileExtension}`)
          .createWriteStream({
            resumable: false,
            gzip: true,
          })
      );
    })
    .catch((e) => console.log(e));
  await sharp(new Buffer(file.data))
    .resize({ width: 720 })
    .toBuffer()
    .then((data) => {
      streamifier.createReadStream(data).pipe(
        imageBucket
          .file(`${variant}/medium/${fileName}.${fileExtension}`)
          .createWriteStream({
            resumable: false,
            gzip: true,
          })
      );
    })
    .catch((e) => console.log(e));
  next();
};
