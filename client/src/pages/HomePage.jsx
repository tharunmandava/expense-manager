import React from 'react';
import {Button} from 'antd';

const HomePage = () => {
  const handleClearLocalStorage = () => {
    localStorage.clear();
    alert('Local storage has been cleared.');
  };

  return (
    <>
     
          <div className="min-h-screen">
      <div className="h-[333px] bg-red-500 flex justify-center items-center">
        <h1 className='text-5xl text-white'>Share Expenses with your friends and family</h1>
          <Button type='primary'
            onClick={handleClearLocalStorage}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition-colors">
            Clear Local Storage
          </Button>
      </div>
      <div className="h-[333px] bg-green-500 flex justify-center items-center">
        <h1 className="text-white text-3xl">Section 2</h1>
      </div>
      <div className="h-[334px] bg-blue-500 flex justify-center items-center">
        <h1 className="text-white text-3xl">Section 3</h1>
      </div>
    </div>
  </>
);
};

export default HomePage;
