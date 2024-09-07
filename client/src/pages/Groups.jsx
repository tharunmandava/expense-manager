import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch groups when component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [API_URL]);

  const handleCreateGroupClick = () => {
    navigate('create');
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}/expenses`);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateGroupClick}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-4"
      >
        Create Group
      </button>

      <h2 className="text-xl font-bold mb-4">Group List</h2>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <div
              key={group.group_id}
              onClick={() => handleGroupClick(group.group_id)}
              className="p-4 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition transform hover:scale-105"
            >
              <h3 className="text-lg font-bold mb-2">{group.group_name}</h3>
              <p className="text-sm text-gray-600">Group ID: {group.group_id}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No groups found.</p>
      )}
    </div>
  );
};

export default Groups;
