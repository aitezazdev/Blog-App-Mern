import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPostById, togglePostSave, toggleLike, deletePost } from "../api/postsApi";
import { getPostComments } from "../api/commentsApi";
import {
  FaHeart,
  FaRegHeart,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { fetchSavedPosts } from "../store/Slices/savedPosts";
import CommentsSection from "../Components/CommentsSection";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { savedPosts } = useSelector((state) => state.savedPosts);
  const { user } = useSelector((state) => state.auth);

  const fetchPost = async () => {
    try {
      const response = await getPostById(id);
      setPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getPostComments(id);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();

    if (user) {
      dispatch(fetchSavedPosts());
    }
  }, [id, dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAuthor = user && post?.author && user._id === post.author._id;

  const isPostSaved = () => {
    return user && savedPosts.some((savedPost) => savedPost._id === id);
  };

  const isPostLiked = () => {
    return user && post?.likes && post.likes.includes(user._id);
  };

  const toggleSave = async () => {
    if (!user) return;
    await togglePostSave(id);
    if (isPostSaved()) {
      toast.success("Post unsaved");
    } else {
      toast.success("Post saved");
    }
    dispatch(fetchSavedPosts());
  };

  const toggleLikePost = async () => {
    if (!user) return;
    await toggleLike(id);
    fetchPost();
  };

  const handleEditPost = () => {
    setShowMenu(false);
    navigate(`/edit-post/${post._id}`);
  };

  const handleDeletePost = async () => {
    setShowMenu(false);
    if (!user) return;
    await deletePost(id);
    toast.success("Post deleted");
    navigate("/");
  };

  const renderLoadingState = () => (
    <div className="min-h-screen pt-20 bg-zinc-950 flex flex-col justify-center items-center">
      <Loader size={40} className="text-indigo-500 animate-spin" />
      <p className="text-zinc-400 text-sm mt-4">Loading article...</p>
    </div>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-zinc-450">
        <div className="text-lg">Article not found</div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 bg-zinc-950 text-zinc-200">
      <div className="bg-zinc-900/40 rounded-xl shadow-xl border border-zinc-800/80 overflow-hidden mb-8">
        {post.image?.url && (
          <div className="w-full h-64 md:h-[400px] overflow-hidden">
            <img
              src={post.image.url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start mb-4 gap-4">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {post.title}
            </h1>

            {isAuthor && (
              <div className="relative flex-shrink-0" ref={menuRef}>
                <button
                  className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition"
                  onClick={() => setShowMenu(!showMenu)}>
                  <FaEllipsisV />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-950 rounded-lg shadow-xl z-10 border border-zinc-800">
                    <div className="py-1">
                      <button
                        onClick={handleEditPost}
                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 flex items-center gap-2 transition cursor-pointer">
                        <FaEdit /> Edit Post
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-900 flex items-center gap-2 transition cursor-pointer">
                        <FaTrash /> Delete Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6 text-sm text-zinc-500">
            <span>
              Posted by{" "}
              <span className="font-semibold text-indigo-400">
                {post.author?.name || "Unknown"}
              </span>{" "}
              on {formattedDate}
            </span>
          </div>

          <div className="text-zinc-300 mb-8 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
            {post.content}
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-md"
                >
                  # {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-zinc-800">
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleLikePost}>
                {isPostLiked() ? (
                  <div className="flex items-center text-red-500">
                    <FaHeart className="mr-1.5" />
                    <span className="text-sm font-medium">
                      {post.likes?.length || 0}{" "}
                      {post.likes?.length === 1 ? "like" : "likes"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-zinc-400 hover:text-red-500 transition duration-150">
                    <FaRegHeart className="mr-1.5" />
                    <span className="text-sm font-medium">
                      {post.likes?.length || 0}{" "}
                      {post.likes?.length === 1 ? "like" : "likes"}
                    </span>
                  </div>
                )}
              </div>

              <div
                className="cursor-pointer text-zinc-400 hover:text-indigo-400 transition duration-150"
                onClick={toggleSave}>
                {isPostSaved() ? (
                  <FaBookmark size={18} className="text-indigo-400" />
                ) : (
                  <FaRegBookmark size={18} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommentsSection postId={id} user={user} initialComments={comments} />
    </div>
  );
};

export default PostDetails;
