import axios from "axios";
import {useState,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/inputfix.css';
import ManageNavBar from "../components/ManageNavBar";

const Balances = () => {
  
  const API_URL = import.meta.env.VITE_API_URL;
  const group_url = useParams().id;
  
  const [balances, setBalances] = useState([]);

  const fetchbalances = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/balances/${group_url}`);
      console.log(group_url);
      console.log(response.data);
      setBalances(response.data);
    } catch (error) {
    }
  };


  useEffect(() => {
    fetchbalances();
  }, [group_url]);

  return (
    
    <div className="  min-h-screen bg-gray-950 py-4">
      <ManageNavBar />
      <div className="flex flex-col items-center">
      {/* Green Section - Balances */}
      <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-white">Balances</h1>
        <div className="space-y-4">
          {balances.map((balance) => (
            <div key={balance.user_id} className="flex justify-between bg-gray-700 border border-gray-600 rounded-lg p-4">
              <span className="text-white">{balance.user_name}</span>
              <span className={`text-white ${balance.total_amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {balance.total_amount}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Blue Section - Reimbursments */}
      <div className="bg-gray-800 border border-gray-900 rounded-lg p-4 mb-4 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-6 text-white">Suggested Reiumbursment</h2>
        <p className="text-white font-semibold pt-4 ml-4 text-center">Update coming soon!</p>
      </div>
  </div>
  </div>
  ); 
}

export default Balances
