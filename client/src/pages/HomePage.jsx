import React from 'react';

const HomePage = () => {
  const handleClearLocalStorage = () => {
    localStorage.clear();
    alert('Local storage has been cleared.');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleClearLocalStorage}
        className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition-colors"
      >
        Clear Local Storage
      </button>
    </div>
  );
};

export default HomePage;
