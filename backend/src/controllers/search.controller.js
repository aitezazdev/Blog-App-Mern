import Post from "../models/post.model.js";
import User from "../models/user.model.js";


const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required." });
    }

    const regex = new RegExp(query, "i");

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData"
        }
      },
      {
        $unwind: "$authorData"
      },
      {
        $match: {
          $or: [
            { title: { $regex: regex } },
            { tags: { $regex: regex } },
            { "authorData.name": { $regex: regex } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          tags: 1,
          content: 1,
          image: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            _id: "$authorData._id",
            name: "$authorData.name",
            email: "$authorData.email"
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Search results fetched via aggregation pipeline.",
      data: posts
    });

  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default searchPosts;
