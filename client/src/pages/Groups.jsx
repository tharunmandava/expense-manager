import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch groups when the component mounts
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

  // Handle group deletion
  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await axios.delete(`${API_URL}/groups/${groupId}`);
        // Update the group list after deletion
        setGroups(groups.filter(group => group.group_id !== groupId));
        console.log(`Group ${groupId} deleted.`);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
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
        <div className="grid grid-cols-2 gap-4">
          {groups.map((group) => (
            <div key={group.group_id} className="relative p-4 border rounded-md shadow hover:bg-gray-100 transition">
              <NavLink
                to={`/groups/${group.group_id}/expenses`}
                className="absolute inset-0 z-10"
              >
                {/* Invisible overlay to make the whole card clickable */}
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
                  Delete
                </button>
              </div>
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
