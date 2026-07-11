import React from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';

const SavePostButton = ({ isSaved, toggleSavePost }) => {

  const toggleSave = () => {
    toggleSavePost();
  };

  return (
    <div className="text-indigo-400 hover:text-indigo-300 transition-colors" onClick={toggleSave}>
      {isSaved ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
    </div>
  );
};

export default SavePostButton;