import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

const Comment = ({ comment, user, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const menuRef = useRef(null);

  const isAuthor = user && comment.user && user._id === comment.user._id;

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

  const handleEditComment = () => {
    setShowMenu(false);
    setIsEditing(true);
  };

  const handleDeleteComment = () => {
    setShowMenu(false);
    onDelete(comment._id);
  };

  const handleSubmitEdit = () => {
    if (editedContent.trim()) {
      onEdit(comment._id, editedContent);
      setIsEditing(false);
    }
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border-b border-zinc-800 pb-5 last:border-0">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-indigo-400 text-sm">
          {comment.user?.name || "Unknown"}
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="text-xs text-zinc-500">{formattedDate}</div>
          
          {isAuthor && (
            <div className="relative" ref={menuRef}>
              <button 
                className="text-zinc-400 hover:text-white cursor-pointer p-1 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setShowMenu(!showMenu)}
              >
                <FaEllipsisV size={12} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-zinc-950 rounded-lg shadow-xl z-10 border border-zinc-800">
                  <div className="py-1">
                    <button
                      onClick={handleEditComment}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <FaEdit size={12} /> Edit
                    </button>
                    <button
                      onClick={handleDeleteComment}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-zinc-900 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="mt-2">
          <textarea
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition text-zinc-100 text-sm"
            rows="2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 rounded-lg transition text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmitEdit}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg transition text-xs font-semibold cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-zinc-300 text-sm leading-relaxed">{comment.content}</p>
      )}
    </div>
  );
};

export default Comment;