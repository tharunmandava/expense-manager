import React, { useState, useEffect, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaCheckCircle, FaCopy } from "react-icons/fa";
import CopyIcon from '../assets/images/copy-icon.svg';
import axios from "axios";
import ClipboardJS from 'clipboard';

// Cache object to store group names
const groupNameCache = {};

const ManageNavBar = () => {
  const { id } = useParams();
  const [groupName, setGroupName] = useState("");
  const [copied, setCopied] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-black bg-opacity-20 rounded-md px-2 py-2"
      : "text-[#B065FF] hover:text-gray-200 rounded-md px-2 py-2";

  useEffect(() => {
    const fetchGroupName = async () => {
      // Check if group name is in cache
      if (groupNameCache[id]) {
        setGroupName(groupNameCache[id]);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/groups/${id}`);
        const name = response.data.group_name;
        setGroupName(name);
        groupNameCache[id] = name; // Store in cache
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    if (id) {
      fetchGroupName();
    }
  }, [id, API_URL]);


  const handleCopyClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', function(e) {
      console.log('Text copied to clipboard:', e.text);
      e.clearSelection();
    });

    clipboard.on('error', function(e) {
      console.error('Failed to copy text:', e);
    });

    return () => clipboard.destroy();
  }, []);

  return (
      <div className="mb-4">
        {groupName && (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {groupName}
            </h2>
            <button
                onClick={handleCopyClick}
                data-clipboard-text={window.location.href.substring(0, window.location.href.lastIndexOf('/'))}
                className="copy-btn flex justify-center items-center text-white rounded-md mt-3 hover:bg-materialblack-300 p-2"
              >
                {copied ? <FaCheckCircle className="pr-1 text-green-500 w-5 h-5" /> : <div className="w-5 h-5"><img src={CopyIcon} className="w-4 h-4"/></div>}
                <div className="text-xxs pb-1">{copied ? 'Copied!' : 'Group URL'}</div>
              </button>
        </div>
        
          
        )}

      
<nav className="bg-gray-800 p-4 rounded-md shadow-lg flex items-center justify-between">
  <ul className="flex flex-row gap-0 text-sm justify-center">
    <li>
      <NavLink to={`/groups/${id}/expenses`} className={linkClass}>
        Expenses
      </NavLink>
    </li>
    <li>
      <NavLink to={`/groups/${id}/balances`} className={linkClass}>
        Balances
      </NavLink>
    </li>
    <li>
      <NavLink to={`/groups/${id}/total`} className={linkClass}>
        Total
      </NavLink>
    </li>
    <li>
      <NavLink to={`/groups/${id}/settings`} className={linkClass}>
        Settings
      </NavLink>
    </li>
  </ul>
</nav>


       
      
    </div>
  );
};

export default ManageNavBar;
