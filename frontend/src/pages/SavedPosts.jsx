import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "../Components/PostCard";
import { fetchSavedPosts } from "../store/Slices/savedPosts";
import { togglePostSave } from "../api/postsApi";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const SavedPosts = () => {
  const dispatch = useDispatch();
  const { savedPosts, loading } = useSelector((state) => state.savedPosts);

  useEffect(() => {
    dispatch(fetchSavedPosts());
  }, [dispatch]);

  const toggleSavePost = async (postId) => {
    await togglePostSave(postId);
    toast.success("Post unsaved");
    dispatch(fetchSavedPosts());
  };

  const renderLoadingState = () => (
   <div className="min-h-screen pt-20 relative bg-zinc-950">
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size={40} className="text-orange-600 animate-spin" />
        <p className="text-zinc-400 text-base mt-4">Loading saved posts...</p>
      </div>
    </div>
  );

  if (loading) {
    return renderLoadingState();
  }

  return (
    <div className="min-h-screen w-full text-zinc-100 py-10 md:px-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10 border-b border-zinc-900 pb-4">
          Bookmarked Articles<span className="text-orange-600">.</span>
        </h2>

        {savedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {savedPosts.map((post) => (
                <PostCard key={post._id}
                  post={post}
                  isSaved={true}
                  toggleSavePost={() => toggleSavePost(post._id)}
                />
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500 pt-16">
            No bookmarked articles yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
