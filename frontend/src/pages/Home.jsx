import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPosts,
  togglePostSave,
  deletePost,
  toggleLike,
} from "../api/postsApi";
import PostCard from "../Components/PostCard";
import { fetchSavedPosts } from "../store/Slices/savedPosts";
import { Link } from "react-router-dom";
import { Plus, Loader } from "lucide-react";
import HomeIntro from "../Components/HomeIntro";
import toast from "react-hot-toast";
import { searchPosts } from "../api/searchApi";

const Home = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const { savedPosts } = useSelector((state) => state.savedPosts);
  const { user } = useSelector((state) => state.auth);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      toast.error("Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim() === "") {
        if (isSearching) {
          fetchPosts();
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      setLoading(true);
      try {
        const response = await searchPosts(searchTerm);
        setPosts(response.data);
      } catch (error) {
        console.error("Search failed:", error);
        toast.error("Search failed. Please try again.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    if (user && posts && posts.length > 0) {
      dispatch(fetchSavedPosts());
    }
  }, [user, posts, dispatch]);

  const isPostSaved = (postId) => {
    return user && savedPosts.some((post) => post._id === postId);
  };

  const isPostLiked = (post) => {
    return user && post.likes && post.likes.includes(user._id);
  };

  const handleToggleSave = async (postId) => {
    if (!user) {
      toast.error("You must be logged in to save a post.");
      return;
    };
    try {
      const response = await togglePostSave(postId);
      const message = response.action === "saved" ? "Post saved" : "Post unsaved";
      toast.success(message);
      dispatch(fetchSavedPosts());
    } catch (error) {
      toast.error("Failed to toggle post save state.");
    }
  };

  const handleToggleLike = async (postId) => {
    if (!user) {
      toast.error("You must be logged in to like a post.");
      return;
    };
    try {
      const response = await toggleLike(postId);
      
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post._id === postId) {
            const updatedLikes = post.likes.includes(user._id) 
              ? post.likes.filter(id => id !== user._id)
              : [...post.likes, user._id];
              
            return { ...post, likes: updatedLikes };
          }
          return post;
        });
      });
    } catch (error) {
      toast.error("Failed to toggle like state.");
    }
  };

  const handlePostDeleted = async (deletedPostId) => {
    if (!user) return;
    await deletePost(deletedPostId);
    toast.success("Post deleted");
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  const renderCreatePostButton = () => (
    <Link
      to="/create-post"
      className="fixed bottom-10 right-10 md:bottom-16 md:right-16 w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-950 shadow-xl hover:bg-white transition-all hover:scale-105 active:scale-95 z-20"
      title="Create Post">
      <Plus size={24} />
    </Link>
  );

  const renderLoadingState = () => (
    <div className="min-h-screen pb-20 relative bg-zinc-950">
      <HomeIntro searchData={setSearchTerm} />
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size={40} className="text-indigo-500 animate-spin" />
        <p className="text-zinc-400 text-base mt-4">Loading posts...</p>
      </div>
      {user && renderCreatePostButton()}
    </div>
  );

  const renderEmptyState = () => (
    <div className="min-h-screen pb-20 relative">
      <HomeIntro searchData={setSearchTerm} />
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-center py-10 text-white text-4xl font-semibold">
          {isSearching ? "No posts match your search" : "No posts found"}
        </p>
      </div>
      {user && renderCreatePostButton()}
    </div>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (!posts || posts.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="min-h-screen pb-20 md:px-16">
      <HomeIntro searchData={setSearchTerm} />

      <div className="w-full px-4 sm:px-6 md:px-10 max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6 mt-10">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            isSaved={isPostSaved(post._id)}
            toggleSavePost={() => handleToggleSave(post._id)}
            isLiked={isPostLiked(post)}
            toggleLikePost={() => handleToggleLike(post._id)}
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </div>

      {user && renderCreatePostButton()}
    </div>
  );
};

export default Home;