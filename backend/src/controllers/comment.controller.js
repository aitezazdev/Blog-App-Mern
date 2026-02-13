import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

// add comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      user: req.user.id,
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: "Comment added",
      data: comment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// edit comment
const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this comment",
      });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment updated",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    const isOwner = comment.user.toString() === req.user.id;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    const post = await Post.findById(comment.post);
    if (post) {
      post.comments.pull(comment._id);
      await post.save();
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// comments for a post
const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Comments fetched",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addComment, editComment, deleteComment, getCommentsForPost };
