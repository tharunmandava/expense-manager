import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ManageNavBar from "../components/ManageNavBar";

const More =  () => {

  const group_id = useParams().id;
  const API_URL = import.meta.env.VITE_API_URL;
  const [data,setData] = useState({'total_expense':'','group_currency':''});

  const fetchdata = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/total-of-group/${group_id}`);
      setData(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchdata();
  },[group_id]);
  

    return (
      <div className="min-h-screen p-4">
        <div className="flex flex-col items-center">
          {/* Wrapper for aligning group name and ManageNavBar */}
          <div className="w-full max-w-3xl">
            <ManageNavBar />
          </div>

          <div className="bg-gray-800 border border-gray-900 rounded-lg p-6 mb-4 max-w-3xl w-full">
              <h1 className="text-2xl font-bold mb-2 text-white">Total group spending</h1>
              {/* output the response data */}
              <p className="font-semibold text-xl text-red-500"> 
                  <span className=""> {data.group_currency} </span> 
                  <span className="" > {data.total_expense} </span>
              </p>
          </div>
      </div>
      </div>
    )
  }
  
  export default More;
  