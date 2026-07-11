import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from '../models/comment.model.js';


const viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};


const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body.profileData;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};


const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userPosts = await Post.find({ author: userId }, '_id');
    const userPostIds = userPosts.map(post => post._id);

    await Comment.deleteMany({ user: userId });

    await Comment.deleteMany({ post: { $in: userPostIds } });

    await Post.updateMany(
      {},
      { $pull: { comments: { $in: [] } } },
      { multi: true }
    );

    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

    await User.updateMany(
      { savedPosts: { $in: userPostIds } },
      { $pull: { savedPosts: { $in: userPostIds } } }
    );

    await Post.deleteMany({ author: userId });

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Account and all associated data deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the account",
      error: error.message
    });
  }
};



export { viewProfile, updateProfile, deleteAccount };
