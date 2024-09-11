import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import {Button} from 'antd';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getAllGroups = async  () => {
    try {
      const response = await axios.get(`${API_URL}/groups/`)
      const data = response.data;


      const groupIds = data.map(data => data.group_id);

      const groupIdsString = JSON.stringify(groupIds);

      localStorage.setItem('groupIds',groupIdsString)



    } catch (error) {
     console.log('oops!',error); 
    }
  };

  useEffect(() => {
    getAllGroups;
  },[])

  return (
    <div className="p-4">

      <button
        onClick={handleCreateGroupClick}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-4"
      >
        Create Group
      </button>

<button onClick={getAllGroups} className='bg-green-600 py-2 px-4 rounded '>get all groups</button>

      <h2 className="text-xl font-bold mb-4">Group List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        groups.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {groups.map((group) => (
              <div key={group.group_id} className="relative p-4 border rounded-md shadow hover:bg-gray-100 transition">
                <NavLink
                  to={`/groups/${group.group_id}/expenses`}
                  className="absolute inset-0 z-10"
                >
                </NavLink>
                <h3 className="text-lg font-bold">{group.group_name}</h3>
                <p className="text-sm">{group.group_description}</p>
                <div className="mt-4 flex justify-between relative z-20">
                  <NavLink
                    to={`/groups/${group.group_id}/expenses`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Expenses
                  </NavLink>
                  <button
                    onClick={() => handleDeleteGroup(group.group_id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete locally
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No groups found.</p>
        )
      )}
    </div>
  );
};

export default Groups;
