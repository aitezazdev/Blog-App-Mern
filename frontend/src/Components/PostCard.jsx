import React, { useState, useRef, useEffect } from "react";
import {
  FaRegCommentDots,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaTag,
} from "react-icons/fa";
import SavePostButton from "./SavePostButton";
import SaveLikeButton from "./SaveLikeButton";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const PostCard = ({
  post,
  toggleSavePost,
  isSaved,
  isLiked,
  toggleLikePost,
  user,
  onPostDeleted,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isAuthor = user && post.author && user._id === post.author._id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditPost = () => {
    setShowMenu(false);
    navigate(`/edit-post/${post._id}`);
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      if (onPostDeleted) onPostDeleted(post._id);
      setShowMenu(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTruncatedContent = (content, wordLimit = 12) => {
    const words = content.trim().split(" ");
    return words.length <= wordLimit
      ? content
      : words.slice(0, wordLimit).join(" ") + " …";
  };

  return (
    <div className="bg-zinc-900/40 rounded-xl hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-zinc-700 transition-all duration-300 border border-zinc-800 overflow-hidden flex flex-col h-[450px]">
      {post.image && (
        <Link to={`/post/${post._id}`} className="h-56 flex-shrink-0">
          <img
            src={post.image.url}
            alt={post.title}
            className="w-full h-full object-cover object-center"
          />
        </Link>
      )}

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="flex justify-between items-start mb-1">
          <Link
            to={`/post/${post._id}`}
            className="text-xl py-1 font-bold text-zinc-100 hover:text-indigo-400 transition-colors line-clamp-2 tracking-tight"
          >
            {getTruncatedContent(post.title, 4)}
          </Link>

          {isAuthor && (
            <div className="relative" ref={menuRef}>
              <button
                className="text-zinc-400 hover:text-white rounded-full cursor-pointer p-1 transition-colors"
                onClick={() => setShowMenu(!showMenu)}
                disabled={isDeleting}
              >
                <FaEllipsisV />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 text-zinc-100 rounded-lg shadow-xl z-10 border border-zinc-800">
                  <div className="py-1">
                    <button
                      onClick={handleEditPost}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-900 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FaEdit /> Edit Post
                    </button>
                    <button
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-900 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FaTrash /> {isDeleting ? "Deleting..." : "Delete Post"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Link
          to={`/post/${post._id}`}
          className="text-zinc-400 text-sm mb-2 line-clamp-2 hover:text-zinc-200 transition pb-2 h-12 overflow-hidden leading-relaxed"
        >
          {getTruncatedContent(post.content, 7)}
        </Link>

        <div className="flex flex-col flex-grow">
          <div>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded hover:bg-indigo-500/20 transition-colors flex items-center gap-1"
                  >
                    # {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-zinc-500">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-xs text-zinc-500 mb-2">
              Posted by{" "}
              <span className="font-medium text-zinc-300">
                {post.author?.name || "Unknown"}
              </span>{" "}
              on {formattedDate}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition-colors">
                  <SaveLikeButton
                    post={post}
                    isLiked={isLiked}
                    toggleLikePost={toggleLikePost}
                  />
                </div>
                <Link
                  to={`/post/${post._id}`}
                  className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 transition-colors"
                >
                  <FaRegCommentDots />
                  <span className="text-sm">{post.comments?.length || 0}</span>
                </Link>
              </div>
              <div className="cursor-pointer text-zinc-400 hover:text-indigo-400 transition-colors">
                <SavePostButton
                  post={post}
                  isSaved={isSaved}
                  toggleSavePost={toggleSavePost}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
