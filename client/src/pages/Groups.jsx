import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { RiGroupLine } from 'react-icons/ri';
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [memberCounts, setMemberCounts] = useState({});
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const storedGroupIds = JSON.parse(localStorage.getItem('groupIds')) || [];
      const groupPromises = storedGroupIds.map(id => axios.get(`${API_URL}/groups/${id}`));
      const responses = await Promise.all(groupPromises);
      const fetchedGroups = responses.map(response => response.data).filter(group => Object.keys(group).length > 0);
      
      setGroups(fetchedGroups);

      if (fetchedGroups.length < responses.length) {
        const validGroupIds = fetchedGroups.map(group => group.group_id); 
        localStorage.setItem('groupIds', JSON.stringify(validGroupIds));
      }

    } catch (error) {
      console.error('Error fetching group details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMemberCounts = useCallback(async () => {
    if (groups.length === 0) return;
    
    try {
      const memberCountPromises = groups.map(group =>
        axios.get(`${API_URL}/groups/users/${group.group_id}`).then(res => ({
          groupId: group.group_id,
          count: res.data.length
        }))
      );
      const results = await Promise.all(memberCountPromises);
      const counts = results.reduce((acc, { groupId, count }) => {
        acc[groupId] = count;
        return acc;
      }, {});
      setMemberCounts(counts);
    } catch (e) {
      console.log('Error fetching member counts:', e);
    }
  }, [groups, API_URL]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    fetchMemberCounts();
  }, [fetchMemberCounts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
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
    setGroups(prevGroups => {
      const updatedGroups = prevGroups.filter(group => group.group_id !== groupId);
      const updatedGroupIds = updatedGroups.map(group => group.group_id);
      localStorage.setItem('groupIds', JSON.stringify(updatedGroupIds));
      return updatedGroups;
    });
    console.log(`Group ${groupId} deleted locally.`);
  };

  const getAllGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/groups/`);
      const data = response.data;
      const groupIds = data.map(group => group.group_id);
      localStorage.setItem('groupIds', JSON.stringify(groupIds));
      setGroups(data);
    } catch (error) {
      console.log('Error fetching all groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (groupId) => {
    setOpenDropdown(prev => (prev === groupId ? null : groupId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content flex-grow */}
      <div className="flex-grow">
        <div className='flex justify-center p-1'>
          <div className="rounded-lg pt-4 mb-0 max-w-3xl w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h2 className="text-xl font-bold mb-4 sm:mb-0">Groups</h2>
              <div className="flex flex-wrap gap-2 sm:gap-2">
                <button
                  onClick={handleCreateGroupClick}
                  className="bg-primary-200 text-white font-semibold py-2 px-3 rounded hover:bg-purple-600 transition-colors"
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
        <div className="flex justify-center p-1">
          <div className="rounded-lg p-2 mb-4 max-w-3xl w-full">
            <div className="p-2">
              {loading ? (
                <p>Loading...</p>
              ) : (
                groups.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    
                    {groups.map((group) => (
                      <div
                        key={group.group_id}
                        className={`relative p-4 border-0 rounded-md shadow bg-gray-800 transition cursor-pointer group w-full ${openDropdown === group.group_id ? 'pointer-events-none' : 'hover:bg-gray-700'}`}
                      >
                        <NavLink
                          to={`/groups/${group.group_id}/expenses`}
                          className="block"
                        >
                          <h3 className="text-ml font-semibold mb-1">{group.group_name}</h3>
                          <p className="text-xs flex items-center gap-2">
                            <RiGroupLine /> {memberCounts[group.group_id] || 0}
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
                          <div ref={dropdownRef} className="absolute top-9 right-2 bg-materialblack-100 text-primary-200 rounded shadow-md pointer-events-auto">
                            <button
                              className="block rounded-md px-4 py-2 hover:bg-gray-500 hover:text-white relative"
                              onClick={() => handleDeleteGroupLocally(group.group_id)}
                            >
                              Remove from device
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
      </div>

    </div>
  );
  
};

export default Groups;