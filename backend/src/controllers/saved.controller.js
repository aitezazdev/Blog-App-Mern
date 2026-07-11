import User from "../models/user.model.js";
import Post from "../models/post.model.js";


const togglePostSave = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPostSaved = user.savedPosts.includes(postId);

    if (isPostSaved) {
      user.savedPosts.pull(postId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post unsaved",
        postId,
        action: "unsaved",
      });
    } else {
      user.savedPosts.addToSet(postId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post saved",
        postId,
        action: "saved",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedPosts");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Saved posts fetched",
      data: user.savedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { togglePostSave, getSavedPosts };
