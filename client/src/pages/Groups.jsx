import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { RiGroupLine } from "react-icons/ri";
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false); // Set initial loading to false
  const [newGroupId, setNewGroupId] = useState(""); // State for new group ID input
  const [openDropdown, setOpenDropdown] = useState(null); // State for tracking open dropdown
  const dropdownRef = useRef(null); // Ref to track dropdown container
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const storedGroupIds = JSON.parse(localStorage.getItem('groupIds')) || [];

        const groupPromises = storedGroupIds.map(id => axios.get(`${API_URL}/groups/${id}`));
        const responses = await Promise.all(groupPromises);
        
        const fetchedGroups = responses.map(response => response.data);
        
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [API_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateGroupClick = () => {
    navigate('create');
  };

  const handleDeleteGroupLocally = (groupId) => {
    const updatedGroups = groups.filter(group => group.group_id !== groupId);
    setGroups(updatedGroups);

    const storedGroupIds = JSON.parse(localStorage.getItem('groupIds')) || [];
    const updatedGroupIds = storedGroupIds.filter(id => id !== groupId);
    localStorage.setItem('groupIds', JSON.stringify(updatedGroupIds));

    console.log(`Group ${groupId} deleted locally.`);
  };

  const getAllGroups = async () => {
    setLoading(true); // Start loading when fetching
    try {
      const response = await axios.get(`${API_URL}/groups/`);
      const data = response.data;

      const groupIds = data.map(group => group.group_id);
      localStorage.setItem('groupIds', JSON.stringify(groupIds));

      setGroups(data); // Update groups with all fetched groups
    } catch (error) {
      console.log('Error fetching all groups:', error);
    } finally {
      setLoading(false); // Stop loading when fetching is done
    }
  };

  const handleAddGroupClick = () => {
    if (newGroupId) {
      navigate(`/groups/${newGroupId}/expenses`);
    }
  };

  const toggleDropdown = (groupId) => {
    setOpenDropdown(openDropdown === groupId ? null : groupId);
  };

  return (
    <>
      {/* buttons section */}
      <div className='flex justify-center p-1'>
        <div className="rounded-lg p-4 mb-4 max-w-3xl w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 className="text-xl font-bold mb-4 sm:mb-0">Groups</h2>
            <div className="flex flex-wrap gap-2 sm:gap-2">
              <button
                onClick={handleCreateGroupClick}
                className="bg-blue-500 text-white font-semibold py-2 px-3 rounded hover:bg-blue-600 transition-colors"
              >
                Create
              </button>

              <button
                onClick={getAllGroups}
                className="bg-green-600 text-white font-semibold py-2 px-3 rounded hover:bg-green-700 transition-colors"
              >
                Get All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* groups section */}
      <div className="flex justify-center p-1">
        <div className="bg-black border border-black rounded-lg p-2 mb-4 max-w-3xl w-full">
          <div className="p-2">
            {loading ? (
              <p>Loading...</p>
            ) : (
              groups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {groups.map((group) => (
                    <div key={group.group_id} className="relative p-4 border rounded-md shadow border-black bg-gray-800 hover:bg-gray-700 transition cursor-pointer group w-full">
                      <NavLink
                        to={`/groups/${group.group_id}/expenses`}
                        className="block"
                      >
                        <h3 className="text-ml font-semibold mb-1">{group.group_name}</h3>
                        <p className="text-xs flex items-center gap-2">
                          <RiGroupLine /> 
                        </p>
                      </NavLink>

                      <button
                        className="absolute top-2 right-2 text-gray-400 group-hover:text-white group-hover:bg-gray-700 bg-gray-800 p-0.5 rounded-md h-6 w-6 flex items-center justify-center"
                        aria-label="More options"
                        onClick={() => toggleDropdown(group.group_id)}
                      >
                        ...
                      </button>

                      {openDropdown === group.group_id && (
                        <div ref={dropdownRef} className="absolute top-9 right-2 bg-black text-red-400 rounded shadow-md">
                          <button
                            className="block px-4 py-2 hover:bg-gray-500 hover:text-white relative"
                            onClick={() => handleDeleteGroupLocally(group.group_id)}
                          >
                            Delete group locally
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No groups found.</p>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Groups;
