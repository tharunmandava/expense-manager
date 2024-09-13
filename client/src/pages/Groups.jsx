import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {FaUsers} from 'react-icons/fa';
import { RiGroupLine } from "react-icons/ri";
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroupId, setNewGroupId] = useState(""); // State for new group ID input
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

  const handleCreateGroupClick = () => {
    navigate('create');
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const updatedGroups = groups.filter(group => group.group_id !== groupId);
        setGroups(updatedGroups);

        const storedGroupIds = JSON.parse(localStorage.getItem('groupIds')) || [];
        const updatedGroupIds = storedGroupIds.filter(id => id !== groupId);
        localStorage.setItem('groupIds', JSON.stringify(updatedGroupIds));

        console.log(`Group ${groupId} deleted.`);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const getAllGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/`);
      const data = response.data;

      const groupIds = data.map(group => group.group_id);
      localStorage.setItem('groupIds', JSON.stringify(groupIds));
    } catch (error) {
      console.log('Error fetching all groups:', error);
    }
  };

  useEffect(() => {
    getAllGroups(); // Call the function to update group IDs
  }, []);

  const handleAddGroupClick = () => {
    if (newGroupId) {
      navigate(`/groups/${newGroupId}/expenses`);
    }
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

        {/* <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newGroupId}
            onChange={(e) => setNewGroupId(e.target.value)}
            placeholder="Enter group ID"
            className="border px-2 py-1 rounded w-full sm:w-auto"
          />

          <button
            onClick={handleAddGroupClick}
            className="bg-blue-600 text-white font-semibold py-2 px-3 rounded hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div> */}
        
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
                        <RiGroupLine /> 4
                      </p>
                    </NavLink>
                    <button
                      className="absolute top-2 right-2 text-gray-400 group-hover:text-white group-hover:bg-gray-700 bg-gray-800 p-0.5 rounded-md h-6 w-6 flex items-center justify-center"
                      aria-label="More options"
                    >
                      :)
                    </button>
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
