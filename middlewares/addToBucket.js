const { Buffer } = require("buffer");
const streamifier = require("streamifier");
const imageBucket = require("../util/GCPbucket");
const sharp = require("sharp");

module.exports = async (req, res, next) => {
  if (req.files) {
    const small = await smallImageUploader(req.files.image, req.body.folder);
    const medium = await mediumImageUploader(req.files.image, req.body.folder);
    const original = await originalImageUploader(
      req.files.image,
      req.body.folder
    );
    req.images = {
      small: small,
      medium: medium,
      original: original,
    };
    req.hasImage = true;
    next();
  } else {
    req.hasImage = false;
    next();
  }
  // const folder = req.body.folder;
  // if (req.files) {
  //   const file = req.files.image;
  //   const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
  //   const fileName = new Date().toISOString();
  //   await streamifier.createReadStream(new Buffer(file.data)).pipe(
  //     imageBucket
  //       .file(`${folder}/original/${fileName}.${fileExtension}`)
  //       .createWriteStream({
  //         resumable: false,
  //         gzip: true,
  //       })
  //   );
  //   await sharp(new Buffer(file.data))
  //     .resize({ width: 360 })
  //     .toBuffer()
  //     .then((data) => {
  //       streamifier.createReadStream(data).pipe(
  //         imageBucket
  //           .file(`${folder}/small/${fileName}.${fileExtension}`)
  //           .createWriteStream({
  //             resumable: false,
  //             gzip: true,
  //           })
  //       );
  //     })
  //     .catch((e) => console.log(e));
  //   await sharp(new Buffer(file.data))
  //     .resize({ width: 720 })
  //     .toBuffer()
  //     .then((data) => {
  //       streamifier
  //         .createReadStream(data)
  //         .pipe(
  //           imageBucket
  //             .file(`${folder}/medium/${fileName}.${fileExtension}`)
  //             .createWriteStream({
  //               resumable: false,
  //               gzip: true,
  //             })
  //         )
  //         .on("finish", () => {
  //           console.log("image uploaded successfully");
  //         });
  //     })
  //     .catch((e) => console.log(e));
  //   req.images = {
  //     small: `https://storage.googleapis.com/fb-clone-images/${folder}/small/${fileName}.${fileExtension}`,
  //     medium: `https://storage.googleapis.com/fb-clone-images/${folder}/medium/${fileName}.${fileExtension}`,
  //     original: `https://storage.googleapis.com/fb-clone-images/${folder}/original/${fileName}.${fileExtension}`,
  //   };
  //   req.hasImage = true;
  // } else {
  //   req.hasImage = false;
  // }

  next();
};

const smallImageUploader = (image, folder) => {
  return new Promise((resolved, rejected) => {
    const file = image;
    const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = new Date().toISOString();
    sharp(new Buffer(file.data))
      .resize({ width: 360 })
      .toBuffer()
      .then((data) => {
        streamifier
          .createReadStream(data)
          .pipe(
            imageBucket
              .file(`${folder}/small/${fileName}.${fileExtension}`)
              .createWriteStream({
                resumable: false,
                gzip: true,
              })
          )
          .on("error", () => {
            rejected();
          })
          .on("finish", () => {
            const small = `https://storage.googleapis.com/fb-clone-images/${folder}/small/${fileName}.${fileExtension}`;
            resolved(small);
          });
      })
      .catch((e) => rejected());
  });
};

const mediumImageUploader = (image, folder) => {
  return new Promise((resolved, rejected) => {
    const file = image;
    const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = new Date().toISOString();
    sharp(new Buffer(file.data))
      .resize({ width: 720 })
      .toBuffer()
      .then((data) => {
        streamifier
          .createReadStream(data)
          .pipe(
            imageBucket
              .file(`${folder}/medium/${fileName}.${fileExtension}`)
              .createWriteStream({
                resumable: false,
                gzip: true,
              })
          )
          .on("error", () => {
            rejected();
          })
          .on("finish", () => {
            const medium = `https://storage.googleapis.com/fb-clone-images/${folder}/medium/${fileName}.${fileExtension}`;
            resolved(medium);
          });
      })
      .catch((e) => rejected());
  });
};
const originalImageUploader = (image, folder) => {
  return new Promise((resolved, rejected) => {
    const file = image;
    const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
    const fileName = new Date().toISOString();
    streamifier
      .createReadStream(new Buffer(file.data))
      .pipe(
        imageBucket
          .file(`${folder}/original/${fileName}.${fileExtension}`)
          .createWriteStream({
            resumable: false,
            gzip: true,
          })
      )
      .on("error", () => {
        rejected();
      })
      .on("finish", () => {
        const original = `https://storage.googleapis.com/fb-clone-images/${folder}/original/${fileName}.${fileExtension}`;
        resolved(original);
      });
  });
};
