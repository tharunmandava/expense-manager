import {useState,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Switch } from 'antd';
import '../styles/inputfix.css';

const Balances = () => {
  
  const API_URL = import.meta.env.VITE_API_URL;

 

 


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 py-4">
    {/* Green Section - Form */}
  <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
    <h1 className="text-2xl font-bold mb-6 text-white">Balances</h1>
   
      <div className="flex space-x-4">
       

       
      </div>

      
       

      
    
      
  
  </div>

  {/* Blue Section - Reimbursments */}
<div className="bg-gray-800 border border-gray-900 rounded-lg p-4 mb-4 max-w-3xl w-full">
  <h2 className="text-2xl font-semibold mb-4 text-white">Suggested Reiumbursment</h2>
  
    </div>



     

      {/* Button at the Bottom Left */}
      <div className="max-w-3xl w-full flex justify-start px-4">
       
      </div>
    </div>
  ); 
}

export default Balances
