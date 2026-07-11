import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../api/postsApi';
import { toast } from 'react-hot-toast';
import PostForm from '../Components/PostForm';
import { Loader } from 'lucide-react';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPostById(id);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to load post');
        toast.error('Failed to load post for editing');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <Loader size={40} className="text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-24 bg-red-950/20 border border-red-900 rounded-lg p-6 shadow text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
        <p className="text-zinc-400 text-sm">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-6 px-4 py-2 text-sm bg-red-900/30 text-red-200 border border-red-800 rounded-lg hover:bg-red-900/50 transition cursor-pointer"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-24 bg-zinc-950 min-h-screen">
      <div className="w-full max-w-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-100 p-6 md:p-10 rounded-xl backdrop-blur-sm shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Edit Post</h1>
        <div>
          {post && <PostForm post={post} isEditing={true} />}
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
