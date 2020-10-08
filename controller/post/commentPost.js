// Model imports
const Posts = require("../../model/Post");
const Comments = require("../../model/Comment");

module.exports = {
  commentPost: (req, res) => {
    const newComment = {
      postId: req.body.postId,
      userId: req.body.userId,
      displayName: req.body.displayName,
      content: req.body.content,
    };
    Comments.create(newComment, async (err, data) => {
      if (err) {
        console.log("Helooo");
        res.status(500).json({ message: err.message });
      } else {
        await Posts.findById(data.postId)
          .then((post) => {
            post.comments.push({
              commentId: data._id,
            });
            return post.save();
          })
          .then((result) =>
            res.status(201).json({
              message: "Comment added to post successfully",
            })
          )
          .catch((e) =>
            res.status(400).json({
              message: e.message,
            })
          );
      }
    });
  },
};
