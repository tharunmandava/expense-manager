import React, { useState, useEffect, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaShareAlt, FaCheckCircle, FaCopy } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";
import axios from "axios";
import ClipboardJS from 'clipboard';

// Cache object to store group names
const groupNameCache = {};

const ManageNavBar = ({ backgroundColor = "gray-800", textColor = "white", activeColor = "gold" }) => {
  const { id } = useParams();
  const [showTick, setShowTick] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [copied, setCopied] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const dropdownRef = useRef(null);

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

  const handleShareClick = () => {
    setShowDropdown(!showDropdown);
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 pb-4">
      {groupName && (
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

        <div className="relative">
          <button
            onClick={handleShareClick}
            className={`bg-gray-700 text-white rounded-md p-4 shadow-lg flex items-center justify-center w-12 h-12`}
          >
            {showTick ? <FaCheckCircle className="text-green-500" /> : <PiShareFatLight />}
          </button>

          {showDropdown && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
              <input
                id="url_text"
                type="text"
                value={window.location.href}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black"
              />
              <button
                onClick={handleCopyClick}
                data-clipboard-target="#url_text"
                className="copy-btn w-full flex items-center justify-center bg-blue-500 text-white rounded-md p-2"
              >
                {copied ? <FaCheckCircle className="mr-2 text-green-500" /> : <FaCopy className="mr-2" />}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageNavBar;
