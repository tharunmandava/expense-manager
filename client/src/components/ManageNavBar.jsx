import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaShareAlt, FaCheckCircle } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";
import axios from "axios";

const ManageNavBar = ({ backgroundColor = "gray-800", textColor = "white", activeColor = "gold" }) => {
  const { id } = useParams();
  const [showTick, setShowTick] = useState(false);
  const [groupName, setGroupName] = useState(""); // State to store the group name
  const API_URL = import.meta.env.VITE_API_URL; // Assuming you're using an environment variable for the API URL

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/${id}`);
        setGroupName(response.data.group_name); // Set the group name from the response
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    if (id) {
      fetchGroupName();
    }
  }, [id, API_URL]);

  const handleShareClick = () => {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // Set the tick icon to show success
        setShowTick(true);
        setTimeout(() => setShowTick(false), 2000); // Show the tick for 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  //------------------------------------------------------------------------------


  return (
    <div className="relative px-4 sm:px-6 lg:px-8 pb-4">
      {groupName && ( // Conditionally render the group name if it's available
        <h2 className="text-center text-xl sm:text-2xl font-bold mb-4 text-white">
          {groupName}
        </h2>
      )}
  
      <div className="flex items-center justify-between flex-nowrap">
        <nav className={`bg-${backgroundColor} p-4 rounded-md shadow-lg flex flex-row items-center justify-between flex-nowrap`}>
          <ul className="flex flex-row gap-4 sm:gap-8">
            <li>
              <NavLink
                to={`/groups/${id}/expenses`}
                className={({ isActive }) =>
                  isActive ? `text-${activeColor}` : `text-${textColor}`
                }
              >
                Expenses
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/groups/${id}/balances`}
                className={({ isActive }) =>
                  isActive ? `text-${activeColor}` : `text-${textColor}`
                }
              >
                Balances
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/groups/${id}/more`}
                className={({ isActive }) =>
                  isActive ? `text-${activeColor}` : `text-${textColor}`
                }
              >
                More
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/groups/${id}/settings`}
                className={({ isActive }) =>
                  isActive ? `text-${activeColor}` : `text-${textColor}`
                }
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
  
        <button
          onClick={handleShareClick}
          className={`bg-gray-700 text-white rounded-md p-4 shadow-lg flex items-center justify-center w-12 h-12`}
        >
          {showTick ? <FaCheckCircle className="text-green-500" /> : <PiShareFatLight />}
        </button>
      </div>
    </div>
  );







}
export default ManageNavBar;


