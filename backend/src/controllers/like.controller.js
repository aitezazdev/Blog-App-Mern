import Post from "../models/post.model.js";


const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.likes.includes(req.user.id)) {
      post.likes.pull(req.user.id);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: "Post unliked", data: post });
    } else {
      post.likes.push(req.user.id);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: "Post liked", data: post });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { toggleLike };
