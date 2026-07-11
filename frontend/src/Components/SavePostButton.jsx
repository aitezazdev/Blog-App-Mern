import React from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';

const SavePostButton = ({ isSaved, toggleSavePost }) => {

  const toggleSave = () => {
    toggleSavePost();
  };

  return (
    <div className="text-orange-600 hover:text-orange-500 transition-colors" onClick={toggleSave}>
      {isSaved ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
    </div>
  );
};

export default SavePostButton;