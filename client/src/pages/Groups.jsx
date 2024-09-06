import React from 'react';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const navigate = useNavigate();

  const handleCreateGroupClick = () => {
    navigate('create');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateGroupClick}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Create Group
      </button>
    </div>
  );
};

export default Groups;
