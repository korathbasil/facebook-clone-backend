// Model imports
const Posts = require("../../model/Posts");

module.exports = {
  likePost: (req, res) => {
    const postId = req.body.postId;
    const action = req.body.like;
    const userId = req.body.userId;
    const displayName = req.body.displayName;
    Posts.findById(postId)
      .then(async (post) => {
        if (action) {
          post.likesCount = post.likesCount + 1;
          post.likes.push({
            userId: userId,
            displayName: displayName,
          });
          return post.save();
        } else {
          if (post.likesCount === 0) {
            res.status(400).send("cant dislike, already no like");
          } else {
            post.likesCount = post.likesCount - 1;
            post.likes.splice(
              post.likes.findIndex((like) => like.userId === userId),
              1
            );
            return post.save();
          }
        }
      })
      .then((result) => res.send(result))
      .catch((e) => res.status(400).json({ message: e.message }));
  },
};
