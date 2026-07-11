import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import { getPostComments, createComment, updateComment, deleteComment } from "../api/commentsApi";
import toast from "react-hot-toast";

const CommentsSection = ({ postId, user, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
    } else {
      fetchComments();
    }
  }, [postId, initialComments]);

  const fetchComments = async () => {
    try {
      const response = await getPostComments(postId);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      setIsSubmitting(true);
      await createComment(postId, commentText);
      toast.success("Comment posted");
      await fetchComments();
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    if (!user) return;
    
    try {
      await updateComment(commentId, content);
      toast.success("Comment updated");
      await fetchComments();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
      await fetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="bg-zinc-900/40 rounded-xl shadow-xl border border-zinc-800 backdrop-blur-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-lg font-bold tracking-tight text-white mb-6">
          Discussion ({comments.length || 0})
        </h2>

        {user ? (
          <form className="mb-8" onSubmit={handleSubmit}>
            <textarea spellCheck="false"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600/25 focus:border-zinc-800 text-zinc-100 placeholder:text-zinc-550 text-sm transition-all duration-200 resize-none"
              rows="3"
              placeholder="Join the discussion..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            <button 
              className="mt-3 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isSubmitting || !commentText.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-center">
            <p className="text-zinc-400 text-sm">Please sign in to post a comment.</p>
          </div>
        )}

        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                user={user}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))
          ) : (
            <div className="py-6 text-center text-zinc-500 text-sm">
              No comments yet. Start the conversation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
