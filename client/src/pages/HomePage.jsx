import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const HomePage = () => {

  const navigate = useNavigate();

  const handleCreateGroupClick = () => {
    navigate('/groups/create');
  };

  useEffect(() => {
    document.body.classList.add('bg-black');

    return () => {
      document.body.classList.remove('bg-black');
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      
      <div className="text-center">
  
        <h1 className="text-4xl font-bold text-white md:text-5xl max-w-xl mx-auto">
          <div>Sharing <span className='text-primary-300'>expenses</span></div>
          <div className='mt-2'>made <span className='text-primary-300'>easy</span></div>
        </h1>
        
        <p className="mt-6 text-lg font-semibold text-gray-400 max-w-md mx-auto">
          No ads, open source & forever free
        </p>
  
        {/* Centered Button */}
        <button className="mt-6 bg-primary-300 hover:bg-primary-200 text-white font-semibold py-2 px-4 rounded hover:bg-primary-600 transition"
          onClick={handleCreateGroupClick} 
        >
          Create a group
        </button>
  
      </div>
  
  </div>

  );
  
  
   
  

  
};

export default HomePage;
