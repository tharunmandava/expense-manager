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
      setBalances(response.data);
    } catch (error) {
    }
  };


  useEffect(() => {
    fetchbalances();
  }, [group_url]);

  return (
    <div className="min-h-screen p-4">
    <div className="flex flex-col items-center">
      {/* Wrapper for aligning group name and ManageNavBar */}
      <div className="w-full max-w-3xl">
        <ManageNavBar />
      </div>
        {/* Green Section - Balances */}
        <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
          <h1 className="text-2xl font-bold mb-6 text-white">Balances</h1>
          <div className="space-y-4">
            {balances
            .filter((balance) => balance.total_amount != 0)
            .map((balance) => (
               
              <div key={balance.user_id} className="flex justify-between bg-gray-700 border border-gray-600 rounded-lg p-4">
                <span className="text-white">{balance.user_name}</span>
                <span className={` ${balance.total_amount < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    { balance.total_amount < 0  
                        ? `+${Math.abs(balance.total_amount).toFixed(2)}` 
                        : `-${balance.total_amount}` 
                    }
                </span>

   
              </div>
            ))}
          </div>
        </div>
        
        {/* Blue Section - Reimbursements */}
        <div className="bg-gray-800 border border-gray-900 rounded-lg p-4 mb-4 max-w-3xl w-full">
          <h2 className="text-2xl font-semibold mb-6 text-white">Suggested Reimbursement</h2>
          <p className="text-white font-semibold pt-4 ml-4 text-center">Update coming soon!</p>
        </div>
      </div>
    </div>
  );
  
}

export default Balances;
