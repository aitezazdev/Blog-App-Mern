import React from 'react';
import PostForm from '../Components/PostForm';

const CreatePost = () => {
  return (
    <div className="min-h-screen flex items-start justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl border border-zinc-800 shadow-2xl p-6 md:p-10 bg-zinc-900/40 text-zinc-100 backdrop-blur-sm">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center text-white">
            Create a New Post
          </h1>
          <PostForm />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
