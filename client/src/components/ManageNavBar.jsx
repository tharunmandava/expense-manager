import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaShareAlt, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

const ManageNavBar = ({ backgroundColor = "gray-800", textColor = "white", activeColor = "gold" }) => {
  const { id } = useParams();
  const [showTick, setShowTick] = useState(false);

  const handleShareClick = () => {
    // Implement your share functionality here
    setShowTick(true);
    setTimeout(() => setShowTick(false), 2000); // Show the tick for 2 seconds
  };

  return (
    <div className="relative">
      <nav className={`bg-${backgroundColor} p-3 text-m mx-auto mt-4 mb-8 w-fit rounded-md shadow-lg`}>
        <ul className="flex justify-center gap-8">
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
     
    </div>
  );
};

export default ManageNavBar;

 {/* <button
        onClick={handleShareClick}
        className="absolute top-1/2 right-10 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 shadow-lg"

      >
        {showTick ? <FaCheckCircle className="text-green-500" /> : <FaShareAlt />}
      </button> */}
