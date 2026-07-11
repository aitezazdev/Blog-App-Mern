import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "../api/postsApi";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

const PostForm = ({ post = null, isEditing = false }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setTags(post.tags || []);
    }
  }, [post, isEditing]);

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (tags.includes(trimmedTag)) {
      toast.error("Tag already exists");
      return;
    }
    if (trimmedTag && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    } else if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (!isEditing && !image) {
      setError("Image is required for posts");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const formData = {
        title,
        content,
        image,
        tags,
      };

      if (isEditing) {
        await updatePost(post._id, formData);
        toast.success("Post updated successfully");
      } else {
        await createPost(formData);
        toast.success("Post created successfully");
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Error submitting post");
      console.error("Error submitting post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-950/20 border border-red-900 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-550 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600/25 focus:border-zinc-800 text-sm transition-all duration-200"
          placeholder="Catchy title goes here..."
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Content
        </label>
        <textarea
          id="content" spellCheck="false"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-550 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600/25 focus:border-zinc-800 text-sm transition-all duration-200 resize-y min-h-[180px]"
          placeholder="Write something great..."
          required
        />
        <p className="mt-2 text-xs text-zinc-500">
          {content.length} characters •{" "}
          {content.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      <div>
        <label htmlFor="image" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Image
        </label>

        {isEditing && post?.image?.url && !image && (
          <div className="mb-3">
            <p className="text-xs text-zinc-500 mb-1.5">Current Image:</p>
            <img
              src={post.image.url}
              alt="Current post"
              className="w-40 h-28 object-cover rounded-lg border border-zinc-800"
            />
          </div>
        )}

        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full text-sm text-zinc-400 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 hover:file:text-white transition-all"
        />

        {image && (
          <p className="text-xs mt-2 text-zinc-500">Selected: {image.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Tags <span className="text-zinc-555 lowercase">(up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center bg-orange-600/10 text-orange-600 px-3 py-1 rounded-lg text-xs font-semibold">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 text-orange-600 hover:text-orange-500 transition-colors cursor-pointer">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            id="tagInput" autoComplete="off"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Press Enter or comma to add tag"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-l-lg p-3 text-sm focus:outline-none focus:border-zinc-800 focus:ring-2 focus:ring-orange-600/25 transition-all"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim()}
            className="px-5 bg-zinc-800 border-y border-r border-zinc-800 text-zinc-200 font-semibold text-xs rounded-r-lg hover:bg-zinc-700 hover:text-white disabled:bg-zinc-900/60 disabled:text-zinc-650 disabled:cursor-not-allowed transition-all cursor-pointer">
            Add
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Use comma or Enter to add new tags
        </p>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-900 mt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="py-2.5 px-5 border border-zinc-800 rounded-lg text-sm text-zinc-300 bg-zinc-900/40 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2.5 px-6 bg-zinc-100 cursor-pointer text-zinc-950 text-sm font-semibold rounded-lg hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isSubmitting && (
            <div className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
          )}
          {isSubmitting
            ? "Submitting..."
            : isEditing
            ? "Update Post"
            : "Publish Post"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
