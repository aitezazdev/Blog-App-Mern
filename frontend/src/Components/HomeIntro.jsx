import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const HomeIntro = ({ searchData }) => {
  const [data, setData] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      searchData(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [data, searchData]);

  const handleChange = (e) => {
    setData(e.target.value);
  };

  return (
    <section className="min-h-[50vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-10 py-16 relative z-10">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
        Insights on Design, Code <br className="hidden sm:block" /> & Digital Tech
      </h1>
      <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
        Thought-provoking articles, practical tutorials, and engineering perspectives curated by digital product builders.
      </p>
      <div className="flex items-center border border-zinc-800 rounded-xl px-4 py-3 w-full max-w-md focus-within:border-zinc-800 focus-within:ring-2 focus-within:ring-orange-600/10 transition-all duration-200 bg-zinc-900/40 backdrop-blur-sm">
        <input
          value={data}
          onChange={handleChange}
          type="text"
          spellCheck="false"
          placeholder="Search articles..."
          className="bg-transparent outline-none text-zinc-100 flex-grow placeholder-zinc-500 text-sm sm:text-base"
        />
        <FiSearch
          className="text-zinc-400 hover:text-white text-xl cursor-pointer ml-2 transition-colors"
          onClick={() => searchData(data)}
        />
      </div>
    </section>
  );
};

export default HomeIntro;
