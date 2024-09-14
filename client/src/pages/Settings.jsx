import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Settings = () => {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([""]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();


  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await axios.get(`${API_URL}/groups/${id}`);
        const membersResponse = await axios.get(`${API_URL}/groups/users/${id}`);
  
        setName(groupResponse.data.group_name);
        setCurrency(groupResponse.data.group_currency);
        setDescription(groupResponse.data.group_description);
        setMembers(membersResponse.data.map(member => member.user_name));
      } catch (error) {
        console.error("Error fetching group or members:", error);
      }
    };
  
    fetchGroupDetails();
  }, []);

  const handleAddMember = () => {
    setMembers([...members, ""]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/groups/${id}`, {
        group_name: name, 
        group_currency: currency,
        group_description: description,
        members: members,
      });
      console.log("Group created:", response.data);
      const groupId = response.data.id;
      navigate(`/groups/${groupId}/expenses`);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {

        // Remove the group from localStorage
        const groups = JSON.parse(localStorage.getItem('groupIds')) || [];
        const updatedGroups = groups.filter(groupId => groupId !== id);
        localStorage.setItem('groupIds', JSON.stringify(updatedGroups));

        await axios.delete(`${API_URL}/groups/${id}`);
  
        // Redirect to /groups
        navigate('/groups');
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };
  

  //----------------------------------------------------------------------------------

  return (
    <div className="flex flex-col items-center min-h-screen py-4">
      {/* Green Section */}
      <div className="bg-black border-2 border-gray-400 rounded-lg p-6 mb-4 max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Edit Group Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Flex container for Group Name and Group Currency */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {/* Group Name */}
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Group Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#B065FF] focus:border-[#B065FF] sm:text-sm"
                required
              />
            </div>

            {/* Group Currency */}
            <div className="flex-1">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-white"
              >
                Group Currency
              </label>
              <input
                type="text"
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 bg-black block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#B065FF] focus:border-[#B065FF] sm:text-sm"
                placeholder="INR, USD, etc."
                required
              />
            </div>
          </div>

          {/* Group Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white"
            >
              Group Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="8"
              className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#B065FF] focus:border-[#B065FF] sm:text-sm"
              placeholder="Enter group description"
            />
          </div>
        </form>
      </div>

      {/* Blue Section */}
      <div className="bg-black border-2  border-gray-400 rounded-lg p-6 mb-4 max-w-3xl w-full">
        <div>
          <label className="block text-sm font-medium text-white">
            Members
          </label>
          {members.map((member, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 bg-black rounded-md shadow-sm focus:outline-none focus:ring-[#B065FF] focus:border-[#B065FF] sm:text-sm"
                placeholder={`Member ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveMember(index)}
                className="bg-red-500 text-white font-semibold py-1 px-2 rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMember}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          disabled
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          onClick={handleSubmit}
        >
          Save Group Changes
        </button>
        <button
          type="submit"
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition-colors"
          onClick={handleDelete}
        >
          Delete Group
        </button>
      </div>

    </div>
  );
};

export default Settings;
